import type { Metadata } from 'next';
import '@fontsource-variable/dm-sans';
import 'leaflet/dist/leaflet.css';
import './globals.css';
import '@fontsource-variable/space-grotesk';
import './studio.css';
import {LanguageProvider} from '@/components/Language';
export const metadata:Metadata={icons:{icon:'/brand/icon.svg'},title:'ORIMERI — Same taste. Different moments.',description:'Same taste. Different moments. A cultural place investigation grounded in Qloo, with evidence, questions and room to change your mind.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en" data-appearance="light"><body><LanguageProvider>{children}</LanguageProvider></body></html>}
