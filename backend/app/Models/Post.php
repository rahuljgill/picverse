<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $fillable = [
        'user_id',
        'image_url',
        'caption',
    ];

    // Post belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Post has many comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // Post has many likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
}