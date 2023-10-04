from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.


class User(AbstractUser):
    pass


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorites')
    animeId = models.IntegerField()
    animeName = models.CharField(max_length=128, blank=True, null=True)
    animeEps = models.IntegerField(blank=True, null=True)
    animeScore = models.FloatField(blank=True, null=True)
    animeImg = models.TextField(max_length=4096, blank=True, null=True)


class Watchlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watchlist')
    animeId = models.IntegerField()
    animeName = models.CharField(max_length=128, blank=True, null=True)
    animeEps = models.IntegerField(blank=True, null=True)
    animeScore = models.FloatField(blank=True, null=True)
    animeImg = models.TextField(max_length=4096, blank=True, null=True)


class Watched(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='watched')
    animeId = models.IntegerField()
    animeName = models.CharField(max_length=128, blank=True, null=True)
    animeEps = models.IntegerField(blank=True, null=True)
    animeScore = models.FloatField(blank=True, null=True)
    animeImg = models.TextField(max_length=4096, blank=True, null=True)
    