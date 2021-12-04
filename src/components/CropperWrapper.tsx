import React, { FC, useRef } from 'react';
import { CropperRef, CropperFade } from 'react-advanced-cropper';
import cn from 'classnames';
import { Spinner } from '../icons/Spinner';
import { Navigation, NavigationRef, PublicNavigationProps } from './Navigation';

export interface CropperWrapperProps<CropperRef = unknown> {
	cropper?: CropperRef;
	loading?: boolean;
	loaded?: boolean;
	className?: string;
	spinnerClassName?: string;
	navigation?: boolean;
	navigationProps?: PublicNavigationProps;
}

export const CropperWrapper: FC<CropperWrapperProps<CropperRef>> = ({
	cropper,
	children,
	loaded,
	loading,
	className,
	spinnerClassName,
	navigation,
	navigationProps,
}) => {
	const state = cropper.getState();

	const navigationRef = useRef<NavigationRef>(null);

	const { rotate } = cropper.getTransforms();

	const transitions = cropper.getTransitions();

	return (
		<div className={cn('rmc-cropper-wrapper', navigation && 'rmc-cropper-wrapper--with-navigation', className)}>
			<CropperFade className={'rmc-cropper-wrapper__fade'} visible={state && loaded}>
				{children}
				{navigation && (
					<Navigation
						ref={navigationRef}
						value={rotate}
						onRotate={cropper.rotateImage}
						onFlip={cropper.flipImage}
						className={cn('rmc-cropper-wrapper__navigation', navigationProps.className)}
						buttonClassName={navigationProps.buttonClassName}
						barClassName={navigationProps.barClassName}
						valueBarClassName={navigationProps.valueBarClassName}
						zeroBarClassName={navigationProps.zeroBarClassName}
						highlightedBarClassName={navigationProps.highlightedBarClassName}
						disabled={transitions.active}
					/>
				)}
			</CropperFade>
			<Spinner
				className={cn(
					'rmc-cropper-wrapper__spinner',
					loading && 'rmc-cropper-wrapper__spinner--visible',
					spinnerClassName,
				)}
			/>
		</div>
	);
};
