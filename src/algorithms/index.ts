import {
	CropperSettings,
	CropperState,
	PostprocessAction,
	getAspectRatio,
	getSizeRestrictions,
	copyState,
	ratio,
	Size,
	applyMove,
	applyScale,
	diff,
	getCenter,
} from 'react-advanced-cropper';

import { fitCircleToImage, fitRectangleToImage } from './position';
import { fittedCircleSize, fittedRectangleSize } from './size';

export function defaultVisibleArea(state: CropperState) {
	const { imageSize, boundary } = state;

	if (imageSize.width / imageSize.height > boundary.width / boundary.height) {
		const width = imageSize.width;
		const height = width / (boundary.width / boundary.height);

		return {
			width,
			height,
			left: 0,
			top: imageSize.height / 2 - height / 2,
		};
	} else {
		const height = imageSize.height;
		const width = (boundary.width / boundary.height) * height;

		return {
			width,
			height,
			left: imageSize.width / 2 - width / 2,
			top: 0,
		};
	}
}

export function defaultSize(state: CropperState) {
	const { imageSize } = state;

	return {
		width: imageSize.width,
		height: imageSize.height,
	};
}

export function postProcess(
	state: CropperState,
	settings: CropperSettings & { stencilType: 'circle' | 'rectangle' },
	action: PostprocessAction,
) {
	const actions = [
		'create',
		'reconcile',
		'interactionEnd',
		'rotate',
		'zoom',
		'setBoundary',
		'setVisibleArea',
		'setCoordinates',
	];
	if (actions.indexOf(action) !== -1) {
		const result = copyState(state);
		const { stencilType } = settings;

		const size = (stencilType === 'circle' ? fittedCircleSize : fittedRectangleSize)({
			width: result.coordinates.width,
			height: result.coordinates.height,
			image: {
				...state.imageSize,
				angle: state.transforms.rotate,
			},
			aspectRatio: getAspectRatio(result, settings),
			sizeRestrictions: getSizeRestrictions(result, settings),
		});

		const previousCenter = getCenter(result.coordinates);

		const currentCenter = getCenter({
			...result.coordinates,
			...size,
		});

		// Return to the original position adjusted for size's change
		result.coordinates = applyMove(
			{
				...result.coordinates,
				...size,
			},
			diff(previousCenter, currentCenter),
		);

		// Move to fit image
		result.coordinates = applyMove(
			result.coordinates,
			(stencilType === 'circle' ? fitCircleToImage : fitRectangleToImage)(result.coordinates, {
				...state.imageSize,
				angle: state.transforms.rotate,
			}),
		);

		// Auto size
		const stencil: Size = {
			width: 0,
			height: 0,
		};
		if (ratio(result.boundary) > ratio(result.coordinates)) {
			stencil.height = result.boundary.height;
			stencil.width = stencil.height * ratio(result.coordinates);
		} else {
			stencil.width = result.boundary.width;
			stencil.height = stencil.width * ratio(result.coordinates);
		}

		// First of all try to resize visible area as much as possible:
		result.visibleArea = applyScale(
			result.visibleArea,
			(result.coordinates.width * result.boundary.width) / (result.visibleArea.width * stencil.width),
		);

		if (ratio(result.boundary) > ratio(result.coordinates)) {
			result.visibleArea.top = result.coordinates.top;
			result.visibleArea.left =
				result.coordinates.left - result.visibleArea.width / 2 + result.coordinates.width / 2;
		} else {
			result.visibleArea.left = result.coordinates.left;
			result.visibleArea.top =
				result.coordinates.top - result.visibleArea.height / 2 + result.coordinates.height / 2;
		}

		return result;
	}

	return state;
}
