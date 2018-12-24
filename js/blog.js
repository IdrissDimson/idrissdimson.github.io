function obtainPosts(){
    fetch('./json/articles.json')
        .then(response => response.json())
        .then(data => {
            let result = '';
            data.forEach((point) =>{
                const {article, author, img_src, title, body} = point ;
                result += 
                    `
                        <article id="article--${article}" class="article">
                            <h1 class="article--heading">${title}</h1>
                            <h3 class="article--subheading">by ${author}</h3>
                            <div class="article--images">
                                <img src="${img_src}" alt="this is homewwork #${article}">
                            </div>
                            <p class="article--body">
                                ${body}
                            </p>
                        </article>
                    `;
                document.getElementById('blogposts').innerHTML = result;
            });
        })
//        .then(data => console.log(data[1].title))
}

obtainPosts(); 