<?php

namespace App\Http\Controllers;
use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    public function store(Request $request)
{
    $validated = $request->validate([
        'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        'caption' => ['nullable', 'string', 'max:2200'],
    ]);

    $path = $request->file('image')->store('posts', 'public');

    $post = Post::create([
        'user_id' => $request->user()->id,
        'image_url' => $path,
        'caption' => $validated['caption'] ?? null,
    ]);

   return response()->json([
    'message' => 'Post created successfully',
], 201);
}

public function index()
{
    $posts = Post::with('user')
        ->withCount(['likes', 'comments'])
        ->latest()
        ->get();

    foreach ($posts as $post) {
        $post->image_url = asset('storage/' . $post->image_url);
        $post->uploaded_ago = $post->created_at->diffForHumans();
    }

    return response()->json($posts);
}
  


}

