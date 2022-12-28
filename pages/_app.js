import '../styles/globals.css'
import Router from 'next/router';

// loading libraries
import NProgress from 'nprogress';
import "nprogress/nprogress.css";

export default function App({ Component, pageProps }) {
// loading indicator config
  NProgress.configure({
    minimum: 0.3,
    easing: 'ease',
    speed: 800,
    showSpinner: true,
  });
  // config when to run loading indicators
  Router.events.on('routeChangeStart', () => NProgress.start());
  Router.events.on('routeChangeComplete', () => NProgress.done());
  Router.events.on('routeChangeError', () => NProgress.done());

  return <Component {...pageProps} />
}
