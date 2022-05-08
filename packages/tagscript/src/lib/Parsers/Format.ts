import { BaseParser } from './Base';
import type { Context } from '../Interpreter';
import type { IParser } from '../interfaces';
import { escapeContent } from '../Utils/Util';

/**
 * This tag formats a given string.
 *
 * @example
 * ```yaml
 *     {lower:Hello Parbez!}
 *     # hello parbez!
 *
 *     {upper:Hello Parbez!}
 *     # HELLO PARBEZ!
 *
 *     {capitalize:hello parbez!}
 *     # Hello parbez!
 *
 *     {titlecase:hello parbez!}
 *     # Hello Parbez!
 *
 *     {escape:Hello| Parbez!}
 *     # Hello\\| Parbez!
 *
 *     {split(;):hi;hey;hello}
 *     # hi,hey,hello
 *     # \ can be used to escape parameter argument separator as shown below:
 *     {split(\,,|):hello,hey,hi}
 *     # hello|hey|hi
 *
 *     {trim:    hey    }
 *     # "hey"
 *     {trimstart:    hey    }
 *     # "hey    "
 *     {trimend:    hey    }
 *     # "    hey"
 * ```
 */
export class StringFormatParser extends BaseParser implements IParser {
	public constructor() {
		super(['lower', 'upper', 'capitalize', 'escape', 'split', 'trim', 'trimstart', 'trimend', 'titlecase'], false, true);
	}

	public parse(ctx: Context) {
		const { declaration, payload, parameter } = ctx.tag;
		switch (declaration as 'lower' | 'upper' | 'capitalize' | 'escape' | 'split' | 'trim' | 'trimstart' | 'trimend' | 'titlecase') {
			case 'lower':
				return payload!.toLowerCase();
			case 'upper':
				return payload!.toUpperCase();
			case 'capitalize':
				return payload!.charAt(0).toUpperCase() + payload!.slice(1);
			case 'titlecase':
				return payload!
					.split(' ')
					.map((w) => w[0].toUpperCase() + w.substring(1).toLowerCase())
					.join(' ');
			case 'trim':
				return payload!.trim();
			case 'trimstart':
				return payload!.trimStart();
			case 'trimend':
				return payload!.trimEnd();
			case 'escape':
				return escapeContent(payload!);
			case 'split': {
				const [splitter, separator = ','] = parameter!.split(/(?<!\\),/g);
				return payload!.split(splitter).join(separator);
			}
		}
	}
}

export class OrdinalFormatParser extends BaseParser implements IParser {
	public constructor() {
		super(['ordinal', 'ord'], false, true);
	}

	public parse(ctx: Context) {
		const { payload } = ctx.tag;
		if (isNaN(Number(payload))) return payload;
		const lastDigit = payload!.slice(-1);
		const suffix = lastDigit === '1' ? 'st' : lastDigit === '2' ? 'nd' : lastDigit === '3' ? 'rd' : 'th';
		return `${payload}${suffix}`;
	}
}
