from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tags', views.TagViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'posts', views.PostViewSet)

urlpatterns = [
    path('', include(router.urls)), # This includes all the routes for tags, categories, and posts
    path('register/', views.CreateUserView.as_view(), name='register'),
    path('login/', views.MyTokenObtainPairView.as_view(), name='login'),
    path('api/navigation/', views.NavigationDataView.as_view(), name='navigation-data'),
    path('posts/<int:post_id>/comments/', views.CommentViewSet.as_view()),
    
    # You also need to add routes for these specific views you wrote:
    path('posts/publish/', views.PostPublishViewSet.as_view()),
    path('posts/category/<int:category_id>/', views.PostListByCategoryViewSet.as_view()),
    path('posts/tag/<int:tag_id>/', views.PostListByTagViewSet.as_view()),
    path('drafts/', views.DraftListViewSet.as_view()),
    path('summarize/<int:post_id>/', views.summarize_post, name='summarize_post'),
]