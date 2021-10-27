import cn from 'classnames';
import { isObject, isString } from './utils';

type ClassNames = Record<string, string>;

export function joinClassNames(...classNames: unknown[]) {
	const result: ClassNames = {};

	classNames.forEach((el) => {
		if (isObject(el)) {
			Object.keys(el).forEach((property) => {
				if (isString(el[property])) {
					result[property] = cn(el[property], result[property]);
				}
			});
		}
	});

	return result;
}
