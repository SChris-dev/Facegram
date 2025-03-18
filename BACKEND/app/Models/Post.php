<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $table = 'posts';

    protected $fillable = [
        'caption',
        'user_id',
        'deleted_at'
    ];

    public function post_attachments() {
        return $this->hasMany(PostAttachment::class, 'post_id', 'id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
