// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser["strict"].exec(str),
		uri = {},
		i   = 10;

	while (i--) uri[o.key[i]] = m[i] || "";
	return uri;
}

parseUri.options = {
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path"],
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*)))/
	}
};