import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {
    startRecord: false,
    startVideo: false
	}
});

export default app;