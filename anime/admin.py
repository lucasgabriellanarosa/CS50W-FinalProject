from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Favorite)
admin.site.register(Watchlist)
admin.site.register(Watched)
