from django.contrib import admin
from .models import Profile,Tag,Category,Post,Newsletter,Comment,Contact,Poll,PollOption,Promotion,VideoAd

admin.site.register([Post,Category,Tag,Contact,Profile,Comment,Newsletter,Poll,PollOption,Promotion,VideoAd])

# Register your models here.
