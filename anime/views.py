from django.shortcuts import render
from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponseRedirect
from django.urls import reverse
from django.db import IntegrityError
import json


# Create your views here.
def index(request):
    return render(request, 'anime/index.html')


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "anime/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "anime/login.html")


@login_required
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]  
        if password != confirmation:
            return render(request, "anime/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "anime/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "anime/register.html")


def anime_details(request, animeID):
    if request.method == 'GET':
        return render(request, 'anime/anime_details.html', {
            "animeID": animeID, 
        })


def genres(request):
    if request.method == 'GET':
        return render(request, 'anime/genres.html') 


def animes_by_genres(request, genreName, genreID):
    if request.method == 'GET':
        return render(request, 'anime/animes_by_genre.html', {
            'genreName': genreName,
            'genreID': genreID
        }) 


@login_required
def favorites(request):
    if request.method == 'GET':    
        current_user = request.user
        favorites_animes = []
        
        try:
            favorites_animes = Favorite.objects.filter(user=current_user)
        except:
            favorites_animes = []

        return render(request, 'anime/favorites.html', {
            'favorites_animes': favorites_animes,
        })


@login_required
def watchlist(request):
    if request.method == 'GET':    
        current_user = request.user
        watchlist = []
        
        try:
            watchlist = Watchlist.objects.filter(user=current_user)
        except:
            watchlist = []

        return render(request, 'anime/watchlist.html', {
            'watchlist': watchlist,
        })


@login_required
def watched(request):
    if request.method == 'GET':    
        current_user = request.user
        watched = []
        
        try:
            watched = Watched.objects.filter(user=current_user)
        except:
            watched = []

        return render(request, 'anime/watched.html', {
            'watched': watched,
        })


def search(request):
    if request.method == 'POST':
        search_query = request.POST['search_query']
        return render(request, 'anime/search.html', {
            'search_query': search_query
        })



# API

@login_required
def getUserRelationWithAnime(request, animeID):
    current_user = request.user
    try:
        if Favorite.objects.get(user=current_user, animeId=animeID):
            is_anime_favorited = True
        else:
            is_anime_favorited = False
    except:
            is_anime_favorited = False

    try:
        if Watchlist.objects.get(user=current_user, animeId=animeID):
            is_anime_watchlist = True
        else:
            is_anime_watchlist = False
    except:
            is_anime_watchlist = False

    try:
        if Watched.objects.get(user=current_user, animeId=animeID):
            is_anime_watched = True
        else:
            is_anime_watched = False
    except:
            is_anime_watched = False
            
    return JsonResponse({"is_anime_favorited": is_anime_favorited, "is_anime_watchlist": is_anime_watchlist, "is_anime_watched": is_anime_watched})


@csrf_exempt
@login_required
def likeLogic(request, animeID):
    if request.method == 'POST':     
        data = json.loads(request.body)
        animeData = data.get('data', [])   
        current_user = request.user
        try:
            if Favorite.objects.get(user=current_user, animeId=animeID):
                is_anime_favorited = True
            else:
                is_anime_favorited = False
        except:
                is_anime_favorited = False
        if is_anime_favorited:
            Favorite.objects.get(user=current_user, animeId=animeID).delete()
            is_anime_favorited = False
        else:
            newFavorite = Favorite(user=current_user, animeName=animeData["title"], animeId=animeData["id"], animeEps=animeData["episodes"], animeScore=animeData["score"], animeImg=animeData["img"])
            newFavorite.save()
            is_anime_favorited = True
        return JsonResponse({"is_anime_favorited": is_anime_favorited})


@csrf_exempt
@login_required
def watchlistLogic(request, animeID):
    if request.method == 'POST':     
        data = json.loads(request.body)
        animeData = data.get('data', [])   
        current_user = request.user
        try:
            if Watchlist.objects.get(user=current_user, animeId=animeID):
                is_anime_watchlist = True
            else:
                is_anime_watchlist = False
        except:
                is_anime_watchlist = False
        if is_anime_watchlist:
            Watchlist.objects.get(user=current_user, animeId=animeID).delete()
            is_anime_watchlist = False
        else:
            newWatchlist = Watchlist(user=current_user, animeName=animeData["title"], animeId=animeData["id"], animeEps=animeData["episodes"], animeScore=animeData["score"], animeImg=animeData["img"])
            newWatchlist.save()
            is_anime_watchlist = True
        return JsonResponse({"is_anime_watchlist": is_anime_watchlist})


@csrf_exempt
@login_required
def watchedLogic(request, animeID):
    if request.method == 'POST':     
        data = json.loads(request.body)
        animeData = data.get('data', [])   
        current_user = request.user
        try:
            if Watched.objects.get(user=current_user, animeId=animeID):
                is_anime_watched = True
            else:
                is_anime_watched = False
        except:
                is_anime_watched = False
        if is_anime_watched:
            Watched.objects.get(user=current_user, animeId=animeID).delete()
            is_anime_watched = False
        else:
            newWatched = Watched(user=current_user, animeName=animeData["title"], animeId=animeData["id"], animeEps=animeData["episodes"], animeScore=animeData["score"], animeImg=animeData["img"])
            newWatched.save()
            is_anime_watched = True
        return JsonResponse({"is_anime_watched": is_anime_watched})

