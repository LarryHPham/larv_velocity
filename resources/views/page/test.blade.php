@extends ('layout.layout1')

@section ('bookmark')
    @include('module.bookmark_bar')
@endsection

@section ('article')
    @include('page.main-content')
@endsection

@section ('social')
    @include ('module.social')
@endsection
