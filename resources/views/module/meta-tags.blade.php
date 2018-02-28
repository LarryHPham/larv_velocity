@include('module.trackAnalytics')
<link rel="canonical" href="{{$metaData['article_url']}}" dochead="1">
@if (!empty($metaData['title']))
    <meta name="title" content="{{$metaData['title']}}" dochead="1"/>
@endif
@if (!empty($metaData['keywords']))
    <meta name="keywords" content="{{implode(', ', $metaData['keywords'])}}" dochead="1">
@endif
@if (!empty($metaData['teaser']))
    <meta name="description" content="{{$metaData['teaser']}}" dochead="1">
@endif
@if (!empty($metaData['title']))
    <meta property="og:title" content="{{$metaData['title']}}" dochead="1">
@endif
@if (!empty($metaData['teaser']))
    <meta property="og:description" content="{{$metaData['teaser']}}" dochead="1">
@endif
<meta property="og:type" content="{{'article'}}" dochead="1">
@if (!empty($metaData['author']))
    <meta property="article:author" content="{{$metaData['author']}}" dochead="1">
@endif
@if (!empty($metaData['publisher']))
    <meta property="article:publisher" content="{{$metaData['publisher']}}" dochead="1">
@endif
@if (!empty($metaData['publication_date']))
    <meta property="article:published_time" content="{{date('c', $metaData['publication_date'])}}" dochead="1">
@endif
@if (!empty($metaData['keywords']))
    <meta property="article:tag" content="{{implode(', ', $metaData['keywords'])}}" dochead="1">
@endif
<meta property="og:url" content="{{$metaData['article_url']}}" dochead="1">
@if (!empty($metaData['image_url']))
    <meta property="og:image" content="{{$metaData['image_url']}}" dochead="1">
@endif
@if ($metaData['client'] == false)
    <link rel="stylesheet" href="{!! $_ENV['APP_URL'] !!}/client/css/app.css">
@endif
