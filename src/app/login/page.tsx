'use client';
import {Brand} from '@/components/Brand';
import {useLanguage,LanguageSwitch} from '@/components/Language';
import {ArrowRight} from 'lucide-react';
export default function Login(){const{t}=useLanguage();return <main className="login-page"><header><a href="/" aria-label="ORIMERI"><Brand/></a><LanguageSwitch/></header><section><h1>{t('loginTitle')}</h1><p>{t('slogan')}</p><p>{t('loginDescription')}</p><a className="primary" href="/">{t('guest')}<ArrowRight size={16}/></a><div className="login-status"><h2>{t('login')}</h2><p>{t('cloudUnavailable')}</p></div><a className="text-button" href="/">{t('loginBack')}</a></section></main>}
