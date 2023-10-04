from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("anime_details/<int:animeID>", views.anime_details, name="anime_details"),
    path('genres', views.genres, name='genres'),
    path('genres/<str:genreName>/<int:genreID>', views.animes_by_genres, name='animes_by_genres'),
    path('favorites', views.favorites, name='favorites'),
    path('watchlist', views.watchlist, name='watchlist'),
    path('watched', views.watched, name='watched'),
    path('search', views.search, name='search'),

    # API
    path('getUserRelationWithAnime/<int:animeID>', views.getUserRelationWithAnime, name='getUserRelationWithAnime'),
    path('likeLogic/<int:animeID>', views.likeLogic, name='likeLogic'),
    path('watchlistLogic/<int:animeID>', views.watchlistLogic, name='watchlistLogic'),
    path('watchedLogic/<int:animeID>', views.watchedLogic, name='watchedLogic'),
]