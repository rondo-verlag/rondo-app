<?php

class CrdParser {
	protected static $_terminals = array(
		/*"/^(root)/" => "T_ROOT",
		"/^(map)/" => "T_MAP",
		"/^(\s+)/" => "T_WHITESPACE",
		"/^(\/[A-Za-z0-9\/:]+[^\s])/" => "T_URL",
		"/^(->)/" => "T_BLOCKSTART",
		"/^(::)/" => "T_DOUBLESEPARATOR",
		"/^(\w+)/" => "T_IDENTIFIER",*/
		"/^(\[[^\]]+\])/" => "T_CHORD",
		"/^(\n\n|\r\r|\r\n\r\n|\n\r\n\r)/s" => "T_PARAGRAPH",
		"/^(\n|\r|\r\n|\n\r)/" => "T_NEWLINE",
		"/^( +)/" => "T_WHITESPACE",
		"/^([^\{\}\n\r\s\[\]]+)/" => "T_STRING",
	);

	public static function run($source) {
		$tokens = array();

		$offset = 0;
		while($offset < strlen($source)) {
			$result = static::_match($source, $offset);
			if($result === false) {
				var_dump($tokens);
				throw new Exception("Unable to parse at char " . ($offset+1) . ': "'.substr($source, $offset, 20).'..."');
			}
			$tokens[] = $result;
			$offset += strlen($result['match']);
		}

		return $tokens;
	}

	protected static function _match($line, $offset) {
		$string = substr($line, $offset);

		foreach(static::$_terminals as $pattern => $name) {
			if(preg_match($pattern, $string, $matches)) {
				return array(
					'match' => $matches[1],
					'token' => $name,
				);
			}
		}

		return false;
	}
} 