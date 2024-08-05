<template>
  <div class="layuot-error">
    <h1 class="status-code">403</h1>
    <p class="message-error">Page not found: /403</p>
    <div class="page-error"></div>
  </div>
</template>

<script setup>
definePageMeta({
	layout: "login-layout",
});
</script>

<style lang="scss" scoped>
.message-error {
	font-size: 2.25rem;
	line-height: 2.5rem;
	font-weight: 300;
	margin-bottom: 4rem !important;
	font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
			Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
			"Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
}
.status-code {
	font-size: 10rem;
	line-height: 1;
	margin-bottom: 2rem !important;
	font-weight: 500;
	color: #181c32;
	font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
			Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif,
			"Apple Color Emoji", "Segoe UI Emoji", Segoe UI Symbol, "Noto Color Emoji";
}
.page-error {
	position: fixed;
	right: 0px;
	left: 0px;
	height: 40vh;
	bottom: -30vh;
	background: linear-gradient(45deg, #00dc82 0%, #36e4da 50%, #0047e1 100%);
	filter: blur(20vh);
	transform-origin: left center;
	transition: transform 0.1s ease 0s, height 0.4s ease 0s, opacity 0.4s ease 0s;
}
.layuot-error {
	position: absolute;
	width: 100%;
	height: 100%;
	top: 0px;
	display: flex;
	text-align: center;
	align-items: center;
	justify-content: center;
	flex-direction: column;
}
</style>
