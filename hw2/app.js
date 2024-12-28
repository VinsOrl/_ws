import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from "./render.js";

// Function to get the current time
function getCurrentTime() {
  return new Date();
}

// Store the time when the page is first loaded
const open = getCurrentTime();

const posts = [
  { id: 0, title: "aaa", body: "aaaaa", created_at: open },
  { id: 1, title: "bbb", body: "bbbbb", created_at: open },
];

const router = new Router();

router
  .get("/", list)
  .get("/post/new", add)
  .get("/post/:id", show)
  .post("/post", create);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function list(ctx) {
  ctx.response.body = await render.list(posts);
}

async function add(ctx) {
  ctx.response.body = await render.newPost();
}

async function show(ctx) {
  const id = ctx.params.id;
  const post = posts.find((p) => p.id === Number(id));
  if (!post) ctx.throw(404, "Invalid post ID");
  ctx.response.body = await render.show(post);
}

async function create(ctx) {
  const body = ctx.request.body({ type: "form" });
  const pairs = await body.value;
  const post = {};
  for (const [key, value] of pairs) {
    post[key] = value;
  }
  post.created_at = getCurrentTime(); // Assign creation time
  post.id = posts.push(post) - 1; // Assign a unique ID
  ctx.response.redirect("/");
}

console.log("Server running at http://127.0.0.1:8000");
await app.listen({ port: 8000 });
