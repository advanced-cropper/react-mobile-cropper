import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DraggableArea, MoveEvent, useWindowResize } from 'react-advanced-cropper';
import cn from 'classnames';
import { range } from '../service/utils';

interface RotateComponentProps {
	from: number;
	to: number;
	value: number;
	step?: number;
	onChange?: (value: number) => void;
	className?: string;
	barsClassName?: string;
	barClassName?: string;
	highlightedBarClassName?: string;
	valueBarClassName?: string;
	zeroBarClassName?: string;
	count?: number;
	thickness?: number;
	density?: number;
}

export interface RotateComponentRef {
	refresh: () => void;
}

export const RotateComponent = forwardRef<RotateComponentRef, RotateComponentProps>(
	(
		{
			from,
			to,
			value,
			step = 2.5,
			thickness = 2,
			onChange,
			className,
			valueBarClassName,
			barsClassName,
			barClassName,
			highlightedBarClassName,
			zeroBarClassName,
			density = 10,
		}: RotateComponentProps,
		ref,
	) => {
		const barsRef = useRef<HTMLDivElement>();

		const [dragging, setDragging] = useState(false);

		const [items, setItems] = useState([]);

		const recalculate = useCallback(() => {
			if (barsRef.current) {
				const width = barsRef.current.clientWidth;

				const count = width / density;

				const neededLeftBarsCount = Math.max(0, Math.floor(count / 2) - Math.round((value - from) / step));

				const neededRightBarsCount = Math.max(0, Math.floor(count / 2) - Math.round((to - value) / step));

				const values = [
					...range(from - neededLeftBarsCount * step, from, step),
					...range(from, to + step, step),
					...range(to + step, to + step + neededRightBarsCount * step, step),
				];

				const radius = Math.abs(Math.ceil(count / 2) * step);

				setItems(
					values.map((barValue) => {
						const sign = Math.sign(barValue - value);

						// Opacity
						let translate;
						if (Math.abs(barValue - value) / step <= Math.ceil(count / 2)) {
							const multiplier =
								Math.sqrt(Math.pow(radius, 2) - Math.pow(value + sign * radius - barValue, 2)) / radius;
							translate = width / 2 + sign * (width / 2) * Math.pow(multiplier, 2.5);
						} else {
							translate = width / 2 + (sign * width) / 2;
						}

						// Translate
						let opacity = 0;
						if (count > 0 && Math.abs(barValue - value) / step <= Math.ceil(count / 2)) {
							opacity = Math.pow(
								Math.sqrt(Math.pow(radius, 2) - Math.pow(value - barValue, 2)) / radius,
								4,
							);
						}

						return {
							value: barValue,
							highlighted:
								(value < 0 && barValue >= value && barValue <= 0) ||
								(value > 0 && barValue <= value && barValue >= 0),
							zero: barValue === 0,
							opacity,
							translate: translate - thickness / 2,
						};
					}),
				);
			}
		}, [density, thickness, from, to, value, step]);

		useWindowResize(() => {
			recalculate();
		});

		useEffect(() => {
			recalculate();
		}, [recalculate]);

		useImperativeHandle(ref, () => {
			return {
				refresh: recalculate,
			};
		});

		const onMove = (e: MoveEvent) => {
			if (barsRef.current) {
				const width = barsRef.current.clientWidth;
				const count = width / density;
				const shift = -(e.directions.left / barsRef.current.clientWidth) * count * step;
				if (onChange) {
					if (value + shift > to) {
						onChange(to - value);
					} else if (value + shift < from) {
						onChange(from - value);
					} else {
						onChange(shift);
					}
				}
			}
		};

		const onMoveEnd = () => {
			document.body.classList.remove('dragging');
			setDragging(false);
		};

		const onMoveStart = () => {
			document.body.classList.add('dragging');
			setDragging(true);
		};

		return (
			<div className={cn('rmc-rotate-component', className)}>
				<DraggableArea onMoveStart={onMoveStart} onMove={onMove} onMoveEnd={onMoveEnd} useAnchor={false}>
					<div
						className={cn(
							'rmc-rotate-component__bars',
							dragging && 'rmc-rotate-component__bars--dragging',
							barsClassName,
						)}
						ref={barsRef}
					>
						{items.map((bar) => (
							<div
								className={cn(
									'rmc-rotate-component__bar',
									bar.zero && 'rmc-rotate-component__bar--zero',
									bar.highlighted && 'rmc-rotate-component__bar--highlighted',
									barClassName,
									bar.highlighted && highlightedBarClassName,
									bar.zero && zeroBarClassName,
								)}
								key={bar.value}
								style={{
									width: bar.opacity ? thickness : 0,
									opacity: bar.opacity,
									transform: `translate(${bar.translate}px, -50%)`,
								}}
							/>
						))}
						<div className={cn('rmc-rotate-component__value', valueBarClassName)}>
							<div className="rmc-rotate-component__value-number">{value.toFixed(1)}°</div>
						</div>
					</div>
				</DraggableArea>
			</div>
		);
	},
);

RotateComponent.displayName = 'RotateComponent';
