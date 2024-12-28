import { Application, Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import * as render from "./render.js";
import { DB } from "https://deno.land/x/sqlite@v3.9.1/mod.ts";

// Initialize SQLite database
const db = new DB("blog.db");
db.query(`
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    title TEXT, 
    body TEXT, 
    user TEXT
)`);

const router = new Router();
router
  .get("/", (ctx) => {
    ctx.response.redirect("/新興/");
  })
  .get("/:user/", list)
  .get("/:user/page/:page", list)
  .get("/:user/post/new", add)
  .get("/:user/post/:id", show)
  .post("/:user/post", create);

const app = new Application();
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error("Error occurred:", err);
    ctx.response.status = 500;
    ctx.response.body = "Internal Server Error";
  }
});
app.use(router.routes());
app.use(router.allowedMethods());

// Helper function to query SQLite database
function query(sql, params = []) {
  const results = [];
  for (const [id, title, body, user] of db.query(sql, params)) {
    results.push({ id, title, body, user });
  }
  return results;
}

async function list(ctx) {
  const user = ctx.params.user;
  const page = parseInt(ctx.params.page) || 1;
  const pageSize = 5; // Number of posts per page
  const offset = (page - 1) * pageSize;

  const posts = query(
    "SELECT id, title, body, user FROM posts WHERE user = ? LIMIT ? OFFSET ?",
    [user, pageSize, offset]
  );
  const totalPosts = query(
    "SELECT COUNT(*) as count FROM posts WHERE user = ?",
    [user]
  )[0].count;

  const totalPages = Math.ceil(totalPosts / pageSize);
  ctx.response.body = await render.list(posts, user, page, totalPages);
}

async function add(ctx) {
  const user = ctx.params.user;
  ctx.response.body = await render.newPost(user);
}

async function show(ctx) {
  const user = ctx.params.user;
  const postId = ctx.params.id;
  const posts = query(
    "SELECT id, title, body, user FROM posts WHERE id = ? AND user = ?",
    [postId, user]
  );
  const post = posts[0];
  if (!post) ctx.throw(404, "Post not found");
  ctx.response.body = await render.show(post, user);
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const post = {};
    for (const [key, value] of pairs) {
      post[key] = value;
    }
    const user = ctx.params.user;
    db.query("INSERT INTO posts (title, body, user) VALUES (?, ?, ?)", [
      post.title,
      post.body,
      user,
    ]);
    ctx.response.redirect(`/${user}/`);
  }
}

const port = parseInt(Deno.args[0]) || 8000;
console.log(`Server is running at http://127.0.0.1:${port}/`);
await app.listen({ port });
