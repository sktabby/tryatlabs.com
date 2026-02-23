import Base64Tool from "./base64-tool/Base64Tool.jsx";
import HashGenerator from "./hash-generator/HashGenerator.jsx";
import JwtDecoder from "./jwt-decoder/JwtDecoder.jsx";
import TimestampGenerator from "./timestamp-generator/TimestampGenerator.jsx";
import UrlEncodeDecode from "./url-encode-decode/UrlEncodeDecode.jsx";
import UuidGenerator from "./uuid-generator/UuidGenerator.jsx";

/* 🔥 NEW TOOLS */
import JsonFormatter from "./json-formatter/JsonFormatter.jsx";
import RegexTester from "./regex-tester/RegexTester.jsx";
import LoremIpsumGenerator from "./lorem-ipsum-generator/LoremIpsumGenerator.jsx";
import RandomStringGenerator from "./random-string-generator/RandomStringGenerator.jsx";
import UrlParser from "./url-parser/UrlParser.jsx";
import NanoidGenerator from "./nanoid-generator/NanoidGenerator.jsx";


import "../styles/tools-ui.css";

export const DEV_TOOL_COMPONENTS = {
  "base64-tool": Base64Tool,
  "hash-generator": HashGenerator,
  "jwt-decoder": JwtDecoder,
  "timestamp-generator": TimestampGenerator,
  "url-encode-decode": UrlEncodeDecode,
  "uuid-generator": UuidGenerator,

  /* 🔥 NEW */
  "json-formatter": JsonFormatter,
  "regex-tester": RegexTester,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "random-string-generator": RandomStringGenerator,
  "url-parser": UrlParser,
  "nanoid-generator": NanoidGenerator,
};
