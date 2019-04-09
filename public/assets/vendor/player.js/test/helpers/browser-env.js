/* eslint-env node */
import { JSDOM } from 'jsdom';

const html = `<body>
	<div id="test_player" data-vimeo-id="2"></div>
	<div class="multiple">
		<iframe class="two" src="https://player.vimeo.com/video/2"></iframe>
		<iframe class="one" src="https://player.vimeo.com/video/76979871"></iframe>
	</div>
</body>`;

global.window = new JSDOM(html).window;
global.document = window.document;
global.navigator = window.navigator;
global.window.jQuery = global.jQuery = require('jquery');
