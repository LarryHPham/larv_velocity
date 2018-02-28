@extends ('layout.layout2')

@section ('bookmark')
    @include('module.bookmark_bar')
@endsection

@section ('article')
    @include('page.main-content')
@endsection

@section ('social')
    @include ('module.social')
@endsection
