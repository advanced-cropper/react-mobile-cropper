import React, { CSSProperties, forwardRef, useImperativeHandle, useRef } from 'react';
import cn from 'classnames';
import {
	CropperStateSettings,
	StencilComponent,
	ResizeImageSettings,
	MoveImageSettings,
	BoundarySizeAlgorithm,
	StretchAlgorithm,
	RectangleStencil,
	CropperBoundaryMethods,
	CropperCanvasMethods,
	useResizeImageOptions,
	useMoveImageOptions,
	useCropperImage,
	useCropperState,
	useWindowResize,
	DrawOptions,
	CropperCanvas,
	CropperRef,
	CropperWrapper,
	CropperBoundary,
	CropperBackgroundImage,
	CropperSettings,
	CropperState,
	CircleStencil,
	isUndefined,
	getAspectRatio,
	getMinimumSize,
	getPositionRestrictions,
	mergePositionRestrictions,
	resizeCoordinatesAlgorithm,
	ResizeOptions,
	coordinatesToPositionRestrictions,
	ResizeDirections,
	useUpdateEffect,
	mergeRefs,
} from 'react-advanced-cropper';
import { defaultSize, defaultVisibleArea, postProcess } from '../algorithms';
import { Spinner } from '../icons/Spinner';
import { joinClassNames } from '../service/styles';
import { Navigation, NavigationRef } from './Navigation';

export interface CropperProps
	extends Omit<CropperStateSettings, 'transitions' | 'priority' | 'imageRestriction' | 'stencilSize'> {
	src?: string;
	stencilType?: 'circle' | 'rectangle';
	stencilProps?: Record<string | number | symbol, unknown>;
	className?: string;
	imageClassName?: string;
	boundaryClassName?: string;
	backgroundClassName?: string;
	checkOrientation?: boolean;
	canvas?: boolean;
	crossOrigin?: 'anonymous' | 'use-credentials';
	resizeImage?: boolean | Omit<ResizeImageSettings, 'adjustStencil'>;
	moveImage?: boolean | MoveImageSettings;
	boundarySizeAlgorithm?: BoundarySizeAlgorithm | string;
	stretchAlgorithm?: StretchAlgorithm;
	wrapperStyle?: CSSProperties;
	onChange?: (cropper: CropperRef) => void;
	onReady?: (cropper: CropperRef) => void;
	onError?: (cropper: CropperRef) => void;
	stencilComponent?: StencilComponent;
	navigation?: boolean;
	navigationProps?: {
		className?: string;
		buttonClassName?: string;
		rotateComponentClassName?: string;
		barClassName?: string;
		highlightedBarClassName?: string;
		activeBarClassName?: string;
		zeroBarClassName?: string;
		valueBarClassName?: string;
	};
}

export const Cropper = forwardRef((props: CropperProps, ref) => {
	const {
		src,
		imageClassName,
		className,
		boundaryClassName,
		backgroundClassName,
		boundarySizeAlgorithm,
		stretchAlgorithm,
		checkOrientation,
		crossOrigin = true,
		canvas = true,
		resizeImage = true,
		moveImage = true,
		navigation = true,
		stencilType = 'rectangle',
		stencilProps = {},
		onReady,
		onError,
		navigationProps = {},
		stencilComponent,
		...cropperSettings
	} = props;

	const stencilRef = useRef<StencilComponent>(null);
	const imageRef = useRef<HTMLImageElement>(null);
	const boundaryRef = useRef<CropperBoundaryMethods>(null);
	const canvasRef = useRef<CropperCanvasMethods>(null);
	const cropperRef = useRef<CropperRef>(null);
	const navigationRef = useRef<NavigationRef>(null);

	const resizeImageOptions = useResizeImageOptions(resizeImage);
	const moveImageOptions = useMoveImageOptions(moveImage);

	const { image, loading, loaded } = useCropperImage({
		src,
		crossOrigin,
		checkOrientation,
		canvas,
		minimumLoadingTime: 500,
		unloadTime: 500,
		onLoad() {
			onReady && onReady(cropperRef.current);
		},
		onError() {
			onError && onError(cropperRef.current);
		},
	});

	const cropper = useCropperState({
		defaultVisibleArea,
		defaultSize,
		postProcess,
		aspectRatio() {
			let minimum, maximum;
			const { aspectRatio, minAspectRatio, maxAspectRatio } = stencilProps;

			if (stencilRef.current && stencilRef.current.aspectRatio) {
				({ minimum, maximum } = stencilRef.current.aspectRatio() || {});
			}

			if (isUndefined(minimum)) {
				minimum = !isUndefined(aspectRatio) ? aspectRatio : minAspectRatio;
			}
			if (isUndefined(maximum)) {
				maximum = !isUndefined(aspectRatio) ? aspectRatio : maxAspectRatio;
			}
			return {
				minimum,
				maximum,
			};
		},
		resizeCoordinates(
			state: CropperState,
			settings: CropperSettings,
			directions: ResizeDirections,
			options: ResizeOptions,
		) {
			const minimumSize = getMinimumSize(state);
			return {
				...state,
				coordinates: resizeCoordinatesAlgorithm(state.coordinates, directions, options, {
					positionRestrictions: mergePositionRestrictions(
						getPositionRestrictions(state, settings),
						coordinatesToPositionRestrictions(state.visibleArea),
					),
					sizeRestrictions: {
						minWidth: minimumSize,
						minHeight: minimumSize,
						maxWidth: state.visibleArea.width,
						maxHeight: state.visibleArea.height,
					},
					aspectRatio: getAspectRatio(state, settings),
				}),
			};
		},
		flipImageAlgorithm(state: CropperState, settings: CropperSettings, horizontal: boolean, vertical: boolean) {
			return {
				...state,
				transforms: {
					...state.transforms,
					flip: {
						horizontal: horizontal ? !state.transforms.flip.horizontal : state.transforms.flip.horizontal,
						vertical: vertical ? !state.transforms.flip.vertical : state.transforms.flip.vertical,
					},
				},
			};
		},
		...cropperSettings,
		stencilType,
		imageRestriction: 'none',
		priority: 'visibleArea',
		transitions: true,
	});

	const resetCropper = () => {
		if (boundaryRef.current) {
			boundaryRef.current.stretchTo(image).then((boundary) => {
				if (boundary) {
					cropper.reset(boundary, image);
				} else {
					cropper.clear();
				}
			});
		}
		if (navigationRef.current) {
			navigationRef.current.refresh();
		}
	};

	const refreshCropper = () => {
		if (boundaryRef.current) {
			boundaryRef.current.stretchTo(image).then((boundary) => {
				if (boundary) {
					if (cropper.state) {
						cropper.setBoundary(boundary);
					} else {
						cropper.reset(boundary, image);
					}
				} else {
					cropper.clear();
				}
			});
		}
		if (navigationRef.current) {
			navigationRef.current.refresh();
		}
	};

	useUpdateEffect(() => {
		cropper.reconcileState();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [stencilType, stencilProps.aspectRatio, stencilProps.maxAspectRatio, stencilProps.minAspectRatio]);

	useUpdateEffect(() => {
		resetCropper();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [image]);

	useWindowResize(() => {
		refreshCropper();
	});

	useImperativeHandle(mergeRefs([ref, cropperRef]), () => ({
		reset: () => {
			resetCropper();
		},
		refresh: () => {
			refreshCropper();
		},
		getCanvas: (options: DrawOptions) => {
			if (imageRef.current && canvasRef.current) {
				return canvasRef.current.draw(cropper.state, imageRef.current, options);
			} else {
				return null;
			}
		},
		getImage: () => {
			return { ...image };
		},
		flip: cropper.flip,
		zoom: cropper.zoom,
		rotate: cropper.rotate,
		move: cropper.move,
		setCoordinates: cropper.setCoordinates,
		setState: cropper.setState,
		getCoordinates: cropper.getCoordinates,
		getVisibleArea: cropper.getVisibleArea,
		getTransforms: cropper.getTransforms,
		getTransitions: cropper.getTransitions,
		getSettings: cropper.getSettings,
		getState: cropper.getState,
	}));

	const Stencil = stencilComponent;

	const basicStencilProps = {
		ref: stencilRef,
		image: image,
		state: cropper.state,
		transitions: cropper.transitions,
		onResize: cropper.onResize,
		onResizeEnd: cropper.onResizeEnd,
		onMove: cropper.onMove,
		onMoveEnd: cropper.onMoveEnd,
		movable: false,
	};

	const rectangleStencilClassNames = {
		lineClassNames: joinClassNames(stencilProps.lineClassNames, {
			default: 'rmc-rectangle-stencil__line',
		}),
		handlerWrapperClassNames: joinClassNames(stencilProps.handlerWrapperClassNames, {
			default: 'rmc-rectangle-stencil__handler-wrapper',
			westNorth: 'rmc-rectangle-stencil__handler-wrapper--west-north',
			eastSouth: 'rmc-rectangle-stencil__handler-wrapper--east-south',
			westSouth: 'rmc-rectangle-stencil__handler-wrapper--west-south',
			eastNorth: 'rmc-rectangle-stencil__handler-wrapper--east-north',
		}),
		handlerClassNames: joinClassNames(stencilProps.handlerClassNames, {
			default: 'rmc-rectangle-stencil__handler',
			hover: 'rmc-rectangle-stencil__handler--hover',
			westNorth: 'rmc-rectangle-stencil__handler--west-north',
			eastSouth: 'rmc-rectangle-stencil__handler--east-south',
			westSouth: 'rmc-rectangle-stencil__handler--west-south',
			eastNorth: 'rmc-rectangle-stencil__handler--east-north',
		}),
	};

	const circleStencilClassNames = {
		lineClassNames: joinClassNames(stencilProps.lineClassNames, {
			default: 'rmc-circle-stencil__line',
		}),
		handlerWrapperClassNames: joinClassNames(stencilProps.handlerWrapperClassNames, {
			default: 'rmc-circle-stencil__handler-wrapper',
			westNorth: 'rmc-circle-stencil__handler-wrapper--west-north',
			eastSouth: 'rmc-circle-stencil__handler-wrapper--east-south',
			westSouth: 'rmc-circle-stencil__handler-wrapper--west-south',
			eastNorth: 'rmc-circle-stencil__handler-wrapper--east-north',
		}),
		handlerClassNames: joinClassNames(stencilProps.handlerClassNames, {
			default: 'rmc-circle-stencil__handler',
			hover: 'rmc-circle-stencil__handler--hover',
			westNorth: 'rmc-circle-stencil__handler--west-north',
			eastSouth: 'rmc-circle-stencil__handler--east-south',
			westSouth: 'rmc-circle-stencil__handler--west-south',
			eastNorth: 'rmc-circle-stencil__handler--east-north',
		}),
		previewClassName: cn(stencilProps.previewClassName, 'rmc-circle-stencil__preview'),
	};

	const { rotate } = cropper.getTransforms();

	return (
		<div className={cn('rmc-cropper', className)}>
			<CropperBoundary
				ref={boundaryRef}
				stretchAlgorithm={stretchAlgorithm}
				sizeAlgorithm={boundarySizeAlgorithm}
				className={cn('rmc-cropper__boundary', boundaryClassName)}
				stretcherClassName={cn('rmc-cropper__stretcher')}
			>
				<CropperWrapper
					className={cn('rmc-cropper__wrapper', loaded && 'rmc-cropper__wrapper--visible')}
					wheelResize={resizeImageOptions.wheel}
					touchResize={resizeImageOptions.touch}
					touchMove={moveImageOptions.touch}
					mouseMove={moveImageOptions.mouse}
					onMove={cropper.onTransformImage}
					onResize={cropper.onTransformImage}
					onTransformEnd={cropper.onTransformImageEnd}
				>
					<div className={cn('rmc-cropper__image-wrapper', backgroundClassName)}>
						{cropper.state && (
							<CropperBackgroundImage
								ref={imageRef}
								crossOrigin={crossOrigin}
								image={image}
								state={cropper.state}
								transitions={cropper.transitions}
								className={cn('rmc-cropper__image', imageClassName)}
							/>
						)}
					</div>
					{Stencil ? (
						<Stencil {...stencilProps} {...basicStencilProps} />
					) : stencilType === 'circle' ? (
						<CircleStencil {...stencilProps} {...basicStencilProps} {...circleStencilClassNames} />
					) : (
						<RectangleStencil {...stencilProps} {...basicStencilProps} {...rectangleStencilClassNames} />
					)}
					{canvas && <CropperCanvas ref={canvasRef} />}
				</CropperWrapper>
				<Spinner
					className={cn('rmc-cropper__spinner', loading && 'rmc-cropper__spinner--visible')}
				/>
			</CropperBoundary>
			{navigation && (
				<Navigation
					ref={navigationRef}
					value={rotate}
					onRotate={cropper.rotate}
					onFlip={cropper.flip}
					className={cn(
						'rmc-cropper__navigation',
						loaded && 'rmc-cropper__navigation--visible',
						navigationProps.className,
					)}
					buttonClassName={navigationProps.buttonClassName}
					barClassName={navigationProps.barClassName}
					valueBarClassName={navigationProps.valueBarClassName}
					zeroBarClassName={navigationProps.zeroBarClassName}
					highlightedBarClassName={navigationProps.highlightedBarClassName}
					disabled={cropper.transitions.active}
				/>
			)}
		</div>
	);
});
