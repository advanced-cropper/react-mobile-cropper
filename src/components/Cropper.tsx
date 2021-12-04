import React, { forwardRef, useRef } from 'react';
import cn from 'classnames';
import {
	Cropper as BasicCropper,
	CropperProps as BasicCropperProps,
	ResizeImageSettings,
	RectangleStencil,
	CropperRef,
	CircleStencil,
	useUpdateEffect,
	mergeRefs,
} from 'react-advanced-cropper';
import {
	customResizeCoordinates,
	customTransformImage,
	getDefaultSize,
	getDefaultVisibleArea,
	mobileAutoZoom,
} from '../algorithms';
import { joinClassNames } from '../service/styles';
import { PublicNavigationProps } from './Navigation';
import { CropperWrapper } from './CropperWrapper';

export interface CropperProps
	extends Omit<BasicCropperProps, 'transitions' | 'priority' | 'imageRestriction' | 'stencilSize' | 'resizeImage'> {
	stencilType?: 'circle' | 'rectangle';
	spinnerClassName?: string;
	resizeImage?: boolean | Omit<ResizeImageSettings, 'adjustStencil'>;
	navigation?: boolean;
	navigationProps?: PublicNavigationProps;
}

export const Cropper = forwardRef((props: CropperProps, ref) => {
	const {
		className,
		spinnerClassName,
		navigation = true,
		stateSettings = {},
		stencilType = 'rectangle',
		stencilProps = {},
		navigationProps = {},
		stencilComponent,
		wrapperComponent = CropperWrapper,
		defaultVisibleArea = getDefaultVisibleArea,
		defaultSize = getDefaultSize,
		transformImageAlgorithm = customTransformImage,
		resizeCoordinatesAlgorithm = customResizeCoordinates,
		postProcess = mobileAutoZoom,
		...cropperProps
	} = props;

	const cropperRef = useRef<CropperRef>(null);

	useUpdateEffect(() => {
		if (cropperRef.current) {
			cropperRef.current.refresh();
		}
	}, [stencilType]);

	let WrapperComponent = wrapperComponent;

	let StencilComponent = stencilComponent;

	let stencilClassNames = {};

	if (!StencilComponent) {
		if (stencilType === 'circle') {
			StencilComponent = CircleStencil;
			stencilClassNames = {
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
		} else {
			StencilComponent = RectangleStencil;
			stencilClassNames = {
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
		}
	}

	return (
		<BasicCropper
			{...cropperProps}
			defaultSize={defaultSize}
			defaultVisibleArea={defaultVisibleArea}
			postProcess={postProcess}
			ref={mergeRefs([ref, cropperRef])}
			imageRestriction={'none'}
			transitions={true}
			priority={'visibleArea'}
			className={cn('rmc-cropper', className)}
			stencilComponent={StencilComponent}
			transformImageAlgorithm={transformImageAlgorithm}
			resizeCoordinatesAlgorithm={resizeCoordinatesAlgorithm}
			stateSettings={{
				...stateSettings,
				stencilType,
			}}
			stencilProps={{
				...stencilProps,
				...stencilClassNames,
				movable: false,
			}}
			wrapperComponent={WrapperComponent}
			wrapperProps={{
				navigationProps,
				navigation,
				spinnerClassName,
			}}
		/>
	);
});

Cropper.displayName = 'Cropper';
