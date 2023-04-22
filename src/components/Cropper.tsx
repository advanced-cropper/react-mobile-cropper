import React, { forwardRef, useRef } from 'react';
import cn from 'classnames';
import {
	Cropper as DefaultCropper,
	CropperProps as DefaultCropperProps,
	CropperRef,
	ImageRestriction,
	mergeRefs,
	ScaleImageOptions,
} from 'react-advanced-cropper';
import {
	fitStencilToImage,
	zoomStencil,
	defaultSize,
	resizeCoordinates,
	stencilConstraints,
	transformImage,
} from 'advanced-cropper/showcase/mobile';
import { PublicNavigationProps } from './Navigation';
import { CropperWrapper } from './CropperWrapper';

export interface CropperProps
	extends Omit<
		DefaultCropperProps,
		'transitions' | 'priority' | 'imageRestriction' | 'stencilSize' | 'stencilConstraints' | 'transformImage'
	> {
	spinnerClassName?: string;
	resizeImage?: boolean | Omit<ScaleImageOptions, 'adjustStencil'>;
	navigation?: boolean;
	navigationProps?: PublicNavigationProps;
	imageRestriction?: ImageRestriction.none | ImageRestriction.stencil;
}

export const Cropper = forwardRef((props: CropperProps, ref) => {
	const {
		className,
		spinnerClassName,
		navigation = true,
		stencilProps = {},
		navigationProps = {},
		wrapperComponent,
		imageRestriction = ImageRestriction.stencil,
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
			defaultSize={defaultSize}
			transformImageAlgorithm={transformImage}
			transitions={true}
			postProcess={imageRestriction === ImageRestriction.none ? zoomStencil : [fitStencilToImage, zoomStencil]}
			resizeCoordinatesAlgorithm={imageRestriction === ImageRestriction.none ? undefined : resizeCoordinates}
		/>
	);
});

Cropper.displayName = 'Cropper';
