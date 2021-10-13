const articles=['Society','Sports','Blogs','Books','Food','Most Popular']
const menuList=document.querySelector('.nav-list')
const container=document.querySelector('.container')
const content=document.querySelector('.content')
let head=document.querySelector('h1')

async function getMostPopular(){
    const request=await(await fetch('https://api.nytimes.com/svc/mostpopular/v2/viewed/1.json?api-key=YcvGZcdvsm8n8tdx1dlUJGesEyBlGyEy ')).json()
   return request
}

async function getData(topic){
const request= 
await(await fetch(`https://api.nytimes.com/svc/search/v2/articlesearch.json?q=${topic}&api-key=G4AjVYd3ZAtdDYC1dd8q9WWnnz2DFyBI`
)).json()
const data=request.response.docs;
return data;

}
function mostPopularContent(topic,data){
    
let obj=data.filter(item=>item.section==topic)[0]
let article=document.createElement('div')
article.classList.add('m-p-article');
console.log(obj);
let imgUrl=obj.media[0]['media-metadata'][2].url
if(!imgUrl)
    imgUrl=''
article.innerHTML=
`<p class="title">${obj.title}</p>
 <img src="${imgUrl}" url="${obj.url}"/>
 <p class="abstract">${obj.abstract}</p>
`
content.appendChild(article)
handleArticle()

}
function handleArticle(){
    const articles=document.querySelectorAll('.m-p-article')
     articles.forEach(art=>{
     art.addEventListener('click',function(e){
         window.open(`${e.target.getAttribute('url')}`,'_blank')
     })
    })
}
function  setMostPopularSite(data){
    const div=document.createElement('div')
    div.classList.add('search-div')
    const select=document.createElement('select')
    const btn=document.createElement('button')
    btn.classList.add('submit')
    btn.textContent='Submit'
    data.forEach(item=>{
        let option=document.createElement('option')
        option.value=item.section;
        option.textContent=item.section;
        select.appendChild(option)
    })
    div.appendChild(select)
    div.appendChild(btn)
    container.insertBefore(div,content)
    document.querySelector('.submit')
    .addEventListener('click',function(e){
    mostPopularContent(select.value,data)
    handleArticle()
})
}
async function setMostPopular(title){
     content.innerHTML=''
     head.textContent='Most Popular';
     const request= await getMostPopular()
     const data=request.results
    setMostPopularSite(data);
    
 }
async function createArticle(art){
     let article=document.createElement('div')
    article.classList.add('article')
    let empty=document.createElement('div')
    let mainP=document.createElement('p')
    mainP.classList.add('main-p')
    mainP.textContent=art.headline.main
    let secondaryP=document.createElement('p')
    secondaryP.classList.add('secondary-p')
    secondaryP.textContent=art.lead_paragraph
    const img= (await fetch('https://api.allorigins.win/raw?url='+art.web_url))
    let link=document.createElement('a')
    link.textContent='Go To Site'
    link.setAttribute('href',img.url)
    link.setAttribute('target','_blank')
    let snippet=document.createElement('span')
    snippet.classList.add('snippet')
    snippet.textContent='Snippet : '+art.snippet;
    let byline=document.createElement('div')
    byline.classList.add('byline')
    let publish=document.createElement('span')
    publish.classList.add('publish')
    publish.textContent=
    `Published : ${art.pub_date}`
    let writtenBy=document.createElement('span')
    writtenBy.classList.add('written')
    writtenBy.textContent=
    `byline : ${art.byline.original}`
    byline.appendChild(publish)
    byline.appendChild(writtenBy)
    article.appendChild(mainP)
    article.appendChild(secondaryP)
    article.appendChild(snippet)
    article.appendChild(byline)
    article.appendChild(link)
    content.appendChild(article)
 
}

async function setSite(topic){
    const data=await getData(topic)
    data.forEach(art=>{    
    createArticle(art)    
    })

}


function fillMenu(){
    articles.forEach(article=>{
        menuList.innerHTML+=
        `<li><a class="topic ${article}">${article}</a></li>`
    })
    handleTopics()   
}


function setTopic(content){

    head.textContent=content;
}


function handleTopics(data){
const topics=document.querySelectorAll('.topic')
topics.forEach(topic=>{
    topic.addEventListener('click',
    function(e){
        if(container.children[2].className=='search-div')
        container.children[2].remove()

        let title=this.textContent
        if(title=='Most Popular')
        setMostPopular(title)
        else{
        setTopic(title)
         content.innerHTML=''
        setSite(title,data)
        }
     }     
     
     )}
)
}



window.onload=()=>{
fillMenu()
setTopic('Sports')
setSite('Sports')  
}
