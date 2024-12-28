export function layout(title, content) {
  return `
    <html>
    <head>
        <title>${title}</title>
        <style>
            body {
                padding: 40px;
                font: 16px Arial, Helvetica;
            }
            h1, h2 {
                color: #333;
            }
            #posts {
                list-style: none;
                padding: 0;
            }
            #posts li {
                margin: 20px 0;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
            }
            #pagination {
                margin: 20px 0;
            }
            #pagination a {
                margin: 0 5px;
                text-decoration: none;
                color: #007BFF;
            }
        </style>
    </head>
    <body>
        ${content}
    </body>
    </html>
    `;
}

export function list(posts, user, currentPage, totalPages) {
  const postItems = posts
    .map(
      (post) =>
        `<li>
                    <h2>${post.title}</h2>
                    <p>${post.body.slice(0, 100)}...</p>
                    <a href="/${user}/post/${post.id}">Read more</a>
                </li>`
    )
    .join("");

  const pagination = Array.from(
    { length: totalPages },
    (_, i) =>
      `<a href="/${user}/page/${i + 1}" ${
        currentPage === i + 1 ? 'style="font-weight: bold;"' : ""
      }>${i + 1}</a>`
  ).join("");

  return layout(
    "Posts",
    `<h1>${user}'s Blog</h1>
        <ul id="posts">
            ${postItems}
        </ul>
        <div id="pagination">
            ${pagination}
        </div>
        <p><a href="/${user}/post/new">Create a new post</a></p>`
  );
}

export function newPost(user) {
  return layout(
    "New Post",
    `<h1>New Post</h1>
        <form action="/${user}/post" method="post">
            <p><input type="text" name="title" placeholder="Title"></p>
            <p><textarea name="body" placeholder="Content"></textarea></p>
            <p><input type="submit" value="Create"></p>
        </form>`
  );
}

export function show(post, user) {
  return layout(
    post.title,
    `<h1>${post.title}</h1>
        <p>${post.body}</p>
        <p><a href="/${user}/">Back to posts</a></p>`
  );
}
