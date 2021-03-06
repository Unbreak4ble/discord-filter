module.exports.getAttrValue = function(text) {
	try {
	//	console.log("first test: ", text);
		
		text = text.replace(
			/((WHERE .*([\s\S]+)?)|(SET .*([\s\S]+)?)|(VALUES .*([\s\S]+)?)|(GROUP BY .*([\s\S]+)?)|(FROM .*([\s\S]+)?)|(DESC .*([\s\S]+)?)|(ORDER BY .*([\s\S]+)?))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
			''
		);

		//console.log("test 1:", text);

		if (/(\b(FROM)\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim.test(text))
			text = text.replace(/((FROM).*([\s\S]+)?)?(?!.*\b\1\b)/gim, '');

		if (/(\b(WHERE)\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim.test(text))
			text = text.replace(/((WHERE).*([\s\S]+)?)(?!.*\b\1\b)/gim, '');

		if (
			/(\b(ORDER BY)\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim.test(text)
		)
			text = text.replace(/((ORDER BY).*([\s\S]+)?)(?!.*\b\1\b)/gim, '');

		//	console.log("test 2: ",text);

		if (
			/(\s?=\s?)(?=(?:(?:[^"]*"?){2})*[^"]*$)((?=([^()]*\([^()]*\))*[^()]*$))/gim.test(
				text
			)
		) {
			idx = text.split(
				/(\s?=\s?)(?=(?:(?:[^"]*"?){2})*[^"]*$)((?=([^()]*\([^()]*\))*[^()]*$))/gim
			);

			text = idx[idx.length - 1].replace(/(^=)/gim, '');
		} else return null;

		//console.log("test 3: ", text)

		if (/^("([^"]*)")/gim.test(text))
			text = text
				.match(/^("([^"]*)(")(?!.*\b\1\b))/gim)[0]
				.replace(/^"/gim, '')
				.replace(/"$/gim, '');
		else text = text.replace(/(\s)$/gim, '').replace(/^(\s)/gim, '');

	//	console.log("last test: ",text)

		return text;
	} catch {
		return null;
	}
};

module.exports.extractGroups = function(text) {
	if (/(\(([^\(].*)(\)))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim.test(text))
		return text.match(
			/(\(([^\(].*)(\)))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim
		);
	else return null;
};

module.exports.extractGroup = function(text) {
	if (/(\(([^\(].*)(\)))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim.test(text))
		return text
			.match(/(\(([^\(].*)(\)))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim)[0]
			.replace(/^\(/gim, '')
			.replace(/\)$/gim, '');
	else return null;
};

module.exports.isMention = function(text) {
	return /<@[0-9]+>/gim.test(text);
};

function containsOnly(separators, name) {
	let ex = 0;

	for (let i of separators)
		if (i === name) {
			ex++;
		}

	return ex >= separators.length ? true : false;
}

module.exports.condition = function(separators, conditions) {
	if (!Array.isArray(separators))
		throw new Error('Separators must be an array.');
	if (!Array.isArray(conditions))
		throw new Error('Conditions must be an array.');
	if (separators.length > conditions.length)
		throw new Error('Failed to compare.');

	const onlyAND = containsOnly(separators, 'AND');
	const onlyOR = containsOnly(separators, 'OR');

	if (onlyAND) {
		let isFullTrue = 0;

		for (let i of conditions) if (i === true) isFullTrue++;

		return isFullTrue >= conditions.length ? true : false;
	} else if (onlyOR) {
		let includesTrue = false;

		for (let i of conditions) if (i === true) includesTrue = true;

		return includesTrue;
	} else {
		let includesTrue = false;

		for (let i of conditions) if (i === true) includesTrue = true;

		return includesTrue;
	}
};

module.exports.getAttr = function(text) {
	if (/(\bFROM\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim.test(text))
		text = text = text.split(
			/(\bFROM\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim
		)[0];

	try {
		if (
			/(=(?=(?:(?:[^"]*"?){2})*[^"]*$))((?=([^()]*\([^()]*\))*[^()]*$))/gim.test(
				text
			)
		) {
			return text
				.split(
					/(=(?=(?:(?:[^"]*"?){2})*[^"]*$))((?=([^()]*\([^()]*\))*[^()]*$))/gim
				)[0]
				.replace(/\s/gim, '');
		} else {
			return text
				.match(/.*? (FROM)/gim)[0]
				.replace(/\s(FROM)$/gim, '')
				.replace(/^\s/gim, '')
				.replace(/\s$/gim, '');
		}
	} catch {
		return text.replace(/(\s)+$/gim, '').replace(/^(\s)+/gim, '');
	}
};

module.exports.getOrderBy = function(text) {
	text = text.split(
		/(\bORDER BY\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim
	);

	text = text.remove('ORDER BY');

	if (text.length > 1) text = text[text.length - 1];
	else text = null;

	if (text !== null)
		text = text.replace(
			/((WHERE .*([\s\S]+)?)|(SET .*([\s\S]+)?)|(VALUES .*([\s\S]+)?)|(GROUP BY .*([\s\S]+)?)|(FROM .*([\s\S]+)?)|(DESC .*([\s\S]+)?)|(ORDER BY .*([\s\S]+)?))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
			''
		);

	return text;
};

module.exports.getDesc = function(text) {
	text = text.split(
		/(\bDESC\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim
	);

	text = text.remove('DESC');

	if (text.length > 1) text = text[text.length - 1];
	else text = null;

	if (text !== null)
		text = text.replace(
			/((WHERE .*([\s\S]+)?)|(SET .*([\s\S]+)?)|(VALUES .*([\s\S]+)?)|(GROUP BY .*([\s\S]+)?)|(FROM .*([\s\S]+)?)|(DESC .*([\s\S]+)?)|(ORDER BY .*([\s\S]+)?))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
			''
		);

	return text;
};

module.exports.getValuesC = function(text) {
	text = text.split(/(\bVALUES\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim);

	text = text.remove('VALUES');

	if (text.length > 1) text = text[text.length - 1];
	else text = null;

	if (text !== null)
		text = text.replace(
			/((WHERE .*([\s\S]+)?)|(SET .*([\s\S]+)?)|(VALUES .*([\s\S]+)?)|(GROUP BY .*([\s\S]+)?)|(FROM .*([\s\S]+)?)|(DESC .*([\s\S]+)?)|(ORDER BY .*([\s\S]+)?))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
			''
		);

	return text;
};

module.exports.getGroupBy = function(text) {
	text = text.split(
		/(\bGROUP BY\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim
	);

	text = text.remove('GROUP BY');

	if (text.length > 1) text = text[text.length - 1];
	else text = null;

	if (text !== null)
		text = text.replace(
			/((WHERE .*([\s\S]+)?)|(SET .*([\s\S]+)?)|(VALUES .*([\s\S]+)?)|(GROUP BY .*([\s\S]+)?)|(FROM .*([\s\S]+)?)|(DESC .*([\s\S]+)?)|(ORDER BY .*([\s\S]+)?))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
			''
		);

	return text;
};

module.exports.getParams = function(text) {
	try {
		text = text.split(
			/(\bWHERE\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"?){2})*[^"]*$)/gim
		);

		text = text.remove('WHERE');
		
		text[0] = text[0]
			.split(' ')
			.slice(1)
			.join(' ');

		return text;
	} catch {
		return [];
	}
};

module.exports.getTarget = function(text) {
	text = text.match(/FROM .*?(( SET .*)?|( WHERE)?|( ORDER BY)?|( DESC)?|( VALUES)?|( GROUP BY)?|\s?)$/gim
	);
	
 
	if (text)
		text = text[0]
			.replace(/^(FROM)/gim, '')
			.replace(
				/((WHERE .*)|(SET .*)|(VALUES .*)|(GROUP BY .*)|(FROM .*)|(DESC .*)|(ORDER BY .*))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
				''
			)
			.replace(/(\s)+$/gim, '')
			.replace(/^(\s)+/gim, '');
	else text = '';

	return text;
};

Array.prototype.remove = function(name) {
	return this.filter(item => {
		if (item !== name) return item;
	});
};

Array.prototype.noremove = function(name) {
	let res = this.filter(item => item === name);
	return res;
};

const willBeArray = array => {
	let willbe = false;

	array.forEach(i => {
		let val = this.getAttrValue(i);

		if (!val) willbe = true;
	});

	return willbe;
};

module.exports.getAttributes = function(text) {
	//console.log("first test: ", text);

	text = text.replace(
			/((WHERE .*([\s\S]+)?)|(SET .*([\s\S]+)?)|(VALUES .*([\s\S]+)?)|(GROUP BY .*([\s\S]+)?)|(FROM .*([\s\S]+)?)|(DESC .*([\s\S]+)?)|(ORDER BY .*([\s\S]+)?))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
			''
		);
		
	let separator = {
		all: [],
		OR: [],
		AND: []
	};

	//console.log("test attr 1: ", text)

	let separators =
		text.match(
			/((AND|,|OR|&&|&|\|\||\|)(?=(?:(?:[^"]*"){2})*[^"]*$))((?=([^()]*\([^()]*\))*[^()]*$))(?!.*\b\1\b)/gim
		) || [];

	separators = separators.filter(
		i =>
			i === 'AND' ||
			i === 'OR' ||
			i === ',' ||
			i === '&&' ||
			i === '&' ||
			i === '||' ||
			i === '|'
	);

	for (let i of separators) {
		if (i === 'AND' || i === ',' || i === '&&' || i === '&') {
			separator.all.push('AND');
			separator.AND.push('AND');
		} else if (i === 'OR' || i === '||' || i === '|') {
			separator.OR.push('OR');
			separator.all.push('OR');
		}
	}

	//console.log("test attr 2: ", text)

	text = text.split(
		/((AND|,|OR|&&|&|\|\||\|)(?=(?:(?:[^"]*"){2})*[^"]*$))((?=([^()]*\([^()]*\))*[^()]*$))(?!.*\b\1\b)/g
	);

	text = text
		.remove('AND')
		.remove(',')
		.remove('&&')
		.remove('&')
		.remove('OR')
		.remove('|')
		.remove('||');

	// console.log("last attr test: ",text)
	//	console.log("separator: ", separator)

	return { separator: separator, text: text };
};

module.exports.getSet = function(text) {
	text = text.split(/(\bSET\b)(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim);

	text = text.remove('SET');

	if (text.length > 1) text = text[text.length - 1];
	else text = null;

	if (text !== null)
		text = text.replace(
			/((WHERE .*)|(SET .*)|(VALUES .*)|(GROUP BY .*)|(FROM .*)|(DESC .*)|(ORDER BY .*))(?!.*\b\1\b)(?=(?:(?:[^"]*"){2})*[^"]*$)/gim,
			''
		);

	return text;
};

module.exports.getAttributesBy = function(text, name) {
	let regex = new RegExp(
		'(\\b' + name + '\\b)(?!.*\\b\\1\\b)(?=(?:(?:[^"]*"){2})*[^"]*$)',
		'g'
	);

	text = text.split(regex).remove(name);

	return text;
};

module.exports.getSid = function(text) {
	if (/<@([0-9]+)>/gim.test(text))
		return text.match(/<@([0-9]+)>/gim)[0].replace(/[<@>]/gim, '');
	else return text.replace(/[<@>]/gim, '');
};

module.exports.revertArray = function(arr) {
	let newArr = [];
	for (let i = 0; i < arr.length; i++) newArr.push(arr[arr.length - 1 - i]);

	return newArr;
};

module.exports.getMethod = function(text) {
	return text.split(/ +/gim)[0];
};

module.exports.countProperty = function(obj, text){
try{
	if(typeof obj !== "object") return null;
	if(Object.keys(obj).length === 0 && obj.constructor === Object) return 0;
	
	obj = Object.keys(obj).filter(i =>{
		if(new RegExp(`${i.replace(/( \([0-9]\))$/g, "")}( \([0-9]\))?`, "g").test(i))
		return i;
	});
	
	return obj ? obj.length : 0;
}catch{return null};
}

module.exports.parse = function(text) {
	return new Promise(async (resolve, reject) => {
		if (typeof text !== 'string') {
			reject("query isn't string");
		}

		let summary = {
				target: '',
				method: '',
				params: []
			},
			i = 0;
		summary.method = this.getMethod(text);
		summary.target = this.getTarget(text);
		let ordby = this.getOrderBy(text);
		let gpby = this.getGroupBy(text);
		let valuesC = this.getValuesC(text);
		let getSet = this.getSet(text);
		let getDesc = this.getDesc(text);
		

		this.getParams(text).forEach(async param => {
			await new Promise(async resolve1 => {
				if (i <= 0) {
					await new Promise(resolve2 => {
						i = 1;
						summary.params[0] = {
							type: 'info',
							items: {},
							groups: []
						};
						
						let SubParams = this.getAttributes(param);

						let separator = SubParams.separator;
						SubParams = SubParams.text;

						if (separator) summary.params[0].separator = separator;

						let willbe = willBeArray(SubParams);

						SubParams.forEach(async sp => {
							await new Promise(resolve3 => {
								let attr = this.getAttr(sp);
								let value = this.getAttrValue(sp);

								if (value !== null) {
									if (Array.isArray(summary.params[0]['items'])) {
										summary.params[0]['items'].push(attr + '=' + value);
									} else {
										if (!willbe) summary.params[0]['items'][attr] = value;
										else {
											if (!Array.isArray(summary.params[0]['items']))
												summary.params[0].items = [];

											summary.params[0].items.push(attr + '=' + value);
										}
									}
								} else {
									if (!Array.isArray(summary.params[0]['items']))
										summary.params[0].items = [];

									summary.params[0]['items'].push(attr);
								}

								resolve3();
							});
						});
						resolve2();
					});
					resolve1();
				} else {
					await new Promise(resolve2 => {
						summary.params[1] = {
							type: 'where',
							items: {},
							groups: []
						};

						let SubParams = this.getAttributes(param);
						let separator = SubParams.separator;
						SubParams = SubParams.text;

						if (separator) summary.params[1].separator = separator;

						let willbe = willBeArray(SubParams);

						SubParams.forEach(async sp => {
							await new Promise(resolve3 => {
								let attr = this.getAttr(sp);
								let value = this.getAttrValue(sp);
								
								let newitem = this.countProperty(summary.params[1].items, attr);
								if(newitem)
								attr = `${attr} (${newitem+1})`;

								if (value !== null) {
									if (Array.isArray(summary.params[1]['items'])) {
										summary.params[1]['items'].push(attr + '=' + value);
									} else {
										if (!willbe) summary.params[1]['items'][attr] = value;
										else {
											if (!Array.isArray(summary.params[1]['items']))
												summary.params[1].items = [];

											summary.params[1].items.push(attr + '=' + value);
										}
									}
								} else {
									if (willbe) {
										if (!Array.isArray(summary.params[1].items))
											summary.params[1].items = [];

										summary.params[1]['items'].push(attr);
									} else summary.params[1].items[attr] = value;
								}

								resolve3();
							});
						});
						resolve2();
					});
					resolve1();
				}
			});
		});

		if (ordby !== null)
			await new Promise(resolve2 => {
				summary.params[2] = {
					type: 'OrderBy',
					items: {},
					groups: []
				};

				let SubParams = this.getAttributes(ordby);
			
				let separator = SubParams.separator;
				SubParams = SubParams.text;

				if (separator) summary.params[2].separator = separator;

				let willbe = willBeArray(SubParams);

				SubParams.forEach(async sp => {
					await new Promise(resolve3 => {
						let attr = this.getAttr(sp);
						let value = this.getAttrValue(sp);

						if (value !== null) {
							if (Array.isArray(summary.params[2]['items'])) {
								summary.params[2]['items'].push(attr + '=' + value);
							} else {
								if (!willbe) summary.params[2]['items'][attr] = value;
								else {
									if (!Array.isArray(summary.params[2]['items']))
										summary.params[2].items = [];

									summary.params[2].items.push(attr + '=' + value);
								}
							}
						} else {
							if (!Array.isArray(summary.params[2].items))
								summary.params[2].items = [];

							summary.params[2]['items'].push(attr);
						}

						resolve3();
					});
				});

				resolve2();
			});

		if (gpby !== null)
			await new Promise(resolve2 => {
				summary.params[3] = {
					type: 'GroupBy',
					items: {},
					groups: []
				};

				let SubParams = this.getAttributes(gpby);
				let separator = SubParams.separator;
				SubParams = SubParams.text;
				let willbe = willBeArray(SubParams);

				if (separator) summary.params[3].separator = separator;

				SubParams.forEach(async sp => {
					await new Promise(resolve3 => {
						let attr = this.getAttr(sp);
						let value = this.getAttrValue(sp);

						if (value !== null) {
							if (Array.isArray(summary.params[3]['items'])) {
								summary.params[3]['items'].push(attr + '=' + value);
							} else {
								if (!willbe) summary.params[3]['items'][attr] = value;
								else {
									if (!Array.isArray(summary.params[3]['items']))
										summary.params[3].items = [];

									summary.params[3].items.push(attr + '=' + value);
								}
							}
						} else {
							if (!Array.isArray(summary.params[3].items))
								summary.params[3].items = [];

							summary.params[3]['items'].push(attr);
						}

						resolve3();
					});
				});

				resolve2();
			});

		if (valuesC !== null)
			await new Promise(resolve2 => {
				summary.params[4] = {
					type: 'values',
					items: {}
				};

				let SubParams = this.getAttributes(valuesC);
				let separator = SubParams.separator;
				SubParams = SubParams.text;

				let willbe = willBeArray(SubParams);

				if (separator) summary.params[4].separator = separator;

				SubParams.forEach(async sp => {
					await new Promise(resolve3 => {
						let attr = this.getAttr(sp);
						let value = this.getAttrValue(sp);

						if (value !== null) {
							if (Array.isArray(summary.params[4]['items'])) {
								summary.params[4]['items'].push(attr + '=' + value);
							} else {
								if (!willbe) summary.params[4]['items'][attr] = value;
								else {
									if (!Array.isArray(summary.params[4]['items']))
										summary.params[4].items = [];

									summary.params[4].items.push(attr + '=' + value);
								}
							}
						} else {
							if (!Array.isArray(summary.params[4].items))
								summary.params[4].items = [];

							summary.params[4]['items'].push(attr);
						}

						resolve3();
					});
				});

				resolve2();
			});

		if (getSet !== null)
			await new Promise(resolve2 => {
				summary.params[5] = {
					type: 'set',
					items: {}
				};

				let SubParams = this.getAttributes(getSet);
				let separator = SubParams.separator;
				SubParams = SubParams.text;

				let willbe = willBeArray(SubParams);

				if (separator) summary.params[5].separator = separator;

				SubParams.forEach(async sp => {
					await new Promise(resolve3 => {
						let attr = this.getAttr(sp);
						let value = this.getAttrValue(sp);

						if (value !== null) {
							if (Array.isArray(summary.params[5]['items'])) {
								summary.params[5]['items'].push(attr + '=' + value);
							} else {
								if (!willbe) summary.params[5]['items'][attr] = value;
								else {
									if (!Array.isArray(summary.params[5]['items']))
										summary.params[5].items = [];

									summary.params[5].items.push(attr + '=' + value);
								}
							}
						} else {
							if (!Array.isArray(summary.params[5].items))
								summary.params[5].items = [];

							summary.params[5]['items'].push(attr);
						}

						resolve3();
					});
				});

				resolve2();
			});
			
			
			
			if (getDesc !== null)
			await new Promise(resolve2 => {
				summary.params[6] = {
					type: 'desc',
					items: {}
				};

				let SubParams = this.getAttributes(getDesc);
				let separator = SubParams.separator;
				SubParams = SubParams.text;

				let willbe = willBeArray(SubParams);

				if (separator) summary.params[6].separator = separator;

				SubParams.forEach(async sp => {
					await new Promise(resolve3 => {
						let attr = this.getAttr(sp);
						let value = this.getAttrValue(sp);

						if (value !== null) {
							if (Array.isArray(summary.params[6]['items'])) {
								summary.params[6]['items'].push(attr + '=' + value);
							} else {
								if (!willbe) summary.params[6]['items'][attr] = value;
								else {
									if (!Array.isArray(summary.params[6]['items']))
										summary.params[6].items = [];

									summary.params[6].items.push(attr + '=' + value);
								}
							}
						} else {
							if (!Array.isArray(summary.params[6].items))
								summary.params[6].items = [];

							summary.params[6]['items'].push(attr);
						}

						resolve3();
					});
				});

				resolve2();
			});
			
			

		summary.params = summary.params.remove(null);

		resolve(summary);
	});
};

function convert(array) {
	let params = [];

	for (let arr in array) {
		params.push(`${arr}="${array[arr]}"`);
	}

	return params;
}

function clean(array) {
	let newArr = [];
	if (!Array.isArray(array)) return array;

	for (let item of array) {
		if (typeof item === 'string' && item.replace(/\s/gim, '').length)
			newArr.push(item);
	}

	return newArr;
}

const addQuotes = obj => {
	let newParams = [];

	obj.forEach(async param => {
		await new Promise(resolve => {
			let items = param.items,
				nitems;

			if (Array.isArray(items)) {
				nitems = [];
				items.forEach(item => {
					let attr = this.getAttr(item);
					let val = this.getAttrValue(item);

					if (val) nitems.push(attr + '=' + `"${val}"`);
					else nitems.push(attr);
				});
			} else {
				nitems = {};

				for (let i in items) {
					nitems[i] = `${items[i]}`;
				}
			}

			newParams.push({ type: param.type, items: nitems });
		});
	});

	return newParams;
};

module.exports.stringify = function(obj) {
	if (typeof obj !== 'object') {
		throw new Error("query isn't object.");
	}

	obj.params = addQuotes(obj.params);

	let text = [];

	text.push(obj.method);

	for (let param of obj.params) {
		if (param.type === 'info') {
			param.items = clean(param.items);
			if (param.items.length === 0) throw new Error('Invalid query.');
			if (Array.isArray(param.items)) {
				text.push(param.items.join(' AND '));
				text.push('FROM ' + obj.target);
			} else if (typeof param.items === 'object') {
				text.push(convert(param.items).join(' AND '));
				text.push('FROM ' + obj.target);
			}
		} else if (param.type === 'where') {
			param.items = clean(param.items);
			if (param.items.length === 0) throw new Error('Invalid query.');
			if (Array.isArray(param.items)) {
				text.push('WHERE ' + param.items.join(' AND '));
			} else if (typeof param.items === 'object') {
				text.push('WHERE ' + convert(param.items).join(' AND '));
			}
		} else if (param.type === 'OrderBy') {
			param.items = clean(param.items);
			if (param.items.length === 0) throw new Error('Invalid query.');

			if (Array.isArray(param.items)) {
				text.push('ORDER BY ' + param.items.join(' AND '));
			} else if (typeof param.items === 'object') {
				text.push('ORDER BY ' + convert(param.items).join(' AND '));
			}
		}
	}

	return text.join(' ');
};

module.exports.isValid = function(text) {
	try {
		text = this.parse(text);

		if (text) return true;
		else return false;
	} catch {
		return false;
	}
};
