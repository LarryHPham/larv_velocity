<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model {
    protected $connection = 'article_library';
    protected $table = 'article';
    public $timestamps = false;
}
