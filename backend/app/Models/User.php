<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        'username',
        'email',
        'password',
        'bio',
        'profile_image_url',
    ];

    protected $hidden = [
        'password',
    ];



    // User has many posts
    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    // User has many comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    // User likes many posts
    public function likes()
    {
        return $this->hasMany(Like::class);
    }

    // Users this user is following
    public function following()
    {
        return $this->belongsToMany(
            User::class,
            'follows',
            'follower_id',
            'following_id'
        );
    }

    // Users who follow this user
    public function followers()
    {
        return $this->belongsToMany(
            User::class,
            'follows',
            'following_id',
            'follower_id'
        );
    }
}