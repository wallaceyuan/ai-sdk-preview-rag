import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import I18nContextProvider from '@/web/context/I18n';
import QueryClientContext from '@/web/context/QueryClient';
import ChakraUIContext from '@/web/context/ChakraUI';
import { appWithTranslation } from 'next-i18next';


function App({ Component, pageProps }: AppProps) {
  return(
    <QueryClientContext>
      <I18nContextProvider>
        <ChakraUIContext>
          <Component {...pageProps} />
        </ChakraUIContext>
      </I18nContextProvider>
    </QueryClientContext>
  )
}

export default appWithTranslation(App)