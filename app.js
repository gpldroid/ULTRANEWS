// app.js

const sitemapURL =
  "https://greatxenforo.blogspot.com/sitemap.xml";

async function loadPosts() {

  try {

    const proxy =
      "https://api.allorigins.win/raw?url=";

    const response = await fetch(proxy + encodeURIComponent(sitemapURL));

    const xmlText = await response.text();

    const parser = new DOMParser();

    const xml = parser.parseFromString(xmlText, "text/xml");

    const urls = [...xml.querySelectorAll("url loc")]
      .map(el => el.textContent)
      .slice(0, 20);

    const posts = [];

    for (const url of urls) {

      try {

        const htmlRes = await fetch(
          proxy + encodeURIComponent(url)
        );

        const html = await htmlRes.text();

        const doc = parser.parseFromString(html, "text/html");

        const title =
          doc.querySelector("title")?.innerText ||
          "بدون عنوان";

        const image =
          doc.querySelector('meta[property="og:image"]')
            ?.content ||
          "https://via.placeholder.com/600x400";

        const description =
          doc.querySelector(
            'meta[name="description"]'
          )?.content || "";

        posts.push({
          title,
          image,
          description,
          url
        });

      } catch (err) {
        console.log(err);
      }

    }

    renderFeatured(posts[0]);

    renderSidebar(posts.slice(1, 5));

    renderPosts(posts.slice(5));

  } catch (error) {

    console.log(error);

  }

}

function renderFeatured(post) {

  document.getElementById("featured-post").innerHTML = `
  
    <img src="${post.image}" alt="">
    
    <div class="hero-content">
      <h1>${post.title}</h1>
      
      <p>${post.description}</p>

      <br>

      <a href="${post.url}" target="_blank">
        قراءة المقال
      </a>
    </div>
  
  `;

}

function renderSidebar(posts) {

  const sidebar = document.getElementById("sidebar-posts");

  sidebar.innerHTML = posts.map(post => `
  
    <div class="side-post">

      <img src="${post.image}" />

      <div>
        <h3>
          <a href="${post.url}" target="_blank">
            ${post.title}
          </a>
        </h3>
      </div>

    </div>

  `).join("");

}

function renderPosts(posts) {

  const container =
    document.getElementById("posts-container");

  container.innerHTML = posts.map(post => `
  
    <div class="post-card">

      <img src="${post.image}" />

      <div class="post-content">

        <h3>
          <a href="${post.url}" target="_blank">
            ${post.title}
          </a>
        </h3>

        <p>${post.description}</p>

      </div>

    </div>
  
  `).join("");

}

loadPosts();
