import { plural } from './plural';

const plurals = [
	[ 1000, ['секунду','секунды','секунд'] ],
	[ 60 * 1000, ['минуту','минуты','минут'] ],
	[ 60 * 1000 * 60, ['час','часа','часов'] ],
	[ 24 * 60 * 1000 * 60, ['день','дня','дней'] ],
	[ 7 * 24 * 60 * 1000 * 60, ['неделю','недели','недель'] ],
	[ 30 * 24 * 60 * 1000 * 60, ['месяц','месяца','месецев'] ],
	[ 365 * 24 * 60 * 1000 * 60, ['год','года','лет'] ],
]

plurals.reverse();

export const ago = (time) => {
	const interval = Date.now() - new Date(time).getTime();

	if(interval === 0) return 'сейчас';

	let pluralForms = plurals.find(forms => interval > forms[0]);
	if(!pluralForms) pluralForms=plurals[0];

	const num = Math.round(interval / pluralForms[0]);
	const pluraledTime = `${num} ${plural(num,pluralForms[1])}`;

	return interval < 0 ? `через ${pluraledTime}` : `${pluraledTime} назад`;
}