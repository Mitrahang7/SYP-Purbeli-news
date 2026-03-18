from django.contrib import admin
from .models import Profile,Tag,Category,Post,Newsletter,Comment,Contact

admin.site.register([Post,Category,Tag,Contact,Profile,Comment,Newsletter])

# Register your models here.
