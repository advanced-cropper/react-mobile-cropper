import React, { forwardRef, useRef } from 'react';
import cn from 'classnames';
import {
	Cropper as DefaultCropper,
	CropperProps as DefaultCropperProps,
	ScaleImageSettings,
	CropperRef,
	mergeRefs,
	ImageRestriction,
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
				grid: true,
				...stencilProps,
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
