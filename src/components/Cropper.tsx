import React, { forwardRef, useRef } from 'react';
import cn from 'classnames';
import {
	Cropper as DefaultCropper,
	CropperProps as DefaultCropperProps,
	ScaleImageSettings,
	CropperRef,
	mergeRefs,
	ImageRestriction,
	joinClassNames,
} from 'react-advanced-cropper';
import {
	autoZoom,
	resizeCoordinates,
	transformImage,
	defaultSize,
	stencilConstraints,
} from 'advanced-cropper/showcase/telegram';
import { PublicNavigationProps } from './Navigation';
import { CropperWrapper } from './CropperWrapper';
import './Cropper.scss';

export interface CropperProps
	extends Omit<
		DefaultCropperProps,
		'transitions' | 'priority' | 'imageRestriction' | 'stencilSize' | 'stencilConstraints' | 'transformImage'
	> {
	spinnerClassName?: string;
	resizeImage?: boolean | Omit<ScaleImageSettings, 'adjustStencil'>;
	navigation?: boolean;
	navigationProps?: PublicNavigationProps;
}

export const Cropper = forwardRef((props: CropperProps, ref) => {
	const {
		className,
		spinnerClassName,
		navigation = true,
		stencilProps = {},
		navigationProps = {},
		wrapperComponent,
		...cropperProps
	} = props;

	const cropperRef = useRef<CropperRef>(null);

	const WrapperComponent = wrapperComponent || CropperWrapper;

	return (
		<DefaultCropper
			{...cropperProps}
			ref={mergeRefs([ref, cropperRef])}
			stencilConstraints={stencilConstraints}
			stencilProps={{
				...stencilProps,
				lineClassNames: joinClassNames(stencilProps.lineClassNames, {
					default: 'rmc-stencil__line',
				}),
				handlerWrapperClassNames: joinClassNames(stencilProps.handlerWrapperClassNames, {
					default: 'rmc-stencil__handler-wrapper',
					westNorth: 'rmc-stencil__handler-wrapper--west-north',
					eastSouth: 'rmc-stencil__handler-wrapper--east-south',
					westSouth: 'rmc-stencil__handler-wrapper--west-south',
					eastNorth: 'rmc-stencil__handler-wrapper--east-north',
				}),
				handlerClassNames: joinClassNames(stencilProps.handlerClassNames, {
					default: 'rmc-stencil__handler',
					hover: 'rmc-stencil__handler--hover',
					westNorth: 'rmc-stencil__handler--west-north',
					eastSouth: 'rmc-stencil__handler--east-south',
					westSouth: 'rmc-stencil__handler--west-south',
					eastNorth: 'rmc-stencil__handler--east-north',
				}),
				previewClassName: cn(stencilProps.previewClassName, 'rmc-stencil__preview'),
				movable: false,
			}}
			wrapperComponent={WrapperComponent}
			wrapperProps={{
				navigationProps,
				navigation,
				spinnerClassName,
			}}
			imageRestriction={ImageRestriction.none}
			className={cn('rmc-cropper', className)}
			postProcess={autoZoom}
			defaultSize={defaultSize}
			transformImageAlgorithm={transformImage}
			resizeCoordinatesAlgorithm={resizeCoordinates}
			transitions={true}
		/>
	);
});

Cropper.displayName = 'Cropper';
