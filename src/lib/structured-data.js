import {siteUrl, siteDescription, supportEmail} from './site.js';

export const organization = {
 '@type':'Organization', '@id':`${siteUrl}/#organization`, name:'Vela', url:siteUrl,
 logo:{'@type':'ImageObject',url:`${siteUrl}/apple-touch-icon.png`},
 email:supportEmail, contactPoint:{'@type':'ContactPoint',email:supportEmail,contactType:'customer support',availableLanguage:'English'},
};
export const website = {
 '@type':'WebSite', '@id':`${siteUrl}/#website`, url:siteUrl, name:'Vela', description:siteDescription,
 publisher:{'@id':organization['@id']},inLanguage:'en',
};
export function breadcrumbs(items) {
 return {'@type':'BreadcrumbList',itemListElement:items.map((item,i)=>({'@type':'ListItem',position:i+1,name:item.name,item:`${siteUrl}${item.path}`}))};
}
export function pageGraph({title,description,path,type='WebPage',items=[]}) {
 return {'@context':'https://schema.org','@graph':[
  {'@type':type,'@id':`${siteUrl}${path}#page`,url:`${siteUrl}${path}`,name:title,description,inLanguage:'en',isPartOf:{'@id':website['@id']},publisher:{'@id':organization['@id']}},
  breadcrumbs([{name:'Home',path:'/'},...items,{name:title,path}]),
 ]};
}
export function faqSchema(faqs,path='/faq') {
 return {'@type':'FAQPage','@id':`${siteUrl}${path}#faq`,url:`${siteUrl}${path}`,mainEntity:faqs.map(f=>({'@type':'Question',name:f.question,acceptedAnswer:{'@type':'Answer',text:f.answer}}))};
}
