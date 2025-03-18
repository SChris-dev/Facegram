<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Follow extends Model
{
    protected $table = 'follow';

    protected $fillable = [
        'follower_id',
        'following_id',
        'is_accepted'
    ];

    public function user_follower() {
        return $this->belongsTo(User::class, 'follower_id', 'id');
    }

    public function user_following() {
        return $this->belongsTo(User::class, 'following_id', 'id');
    }

}
