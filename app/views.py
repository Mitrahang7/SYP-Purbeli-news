from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer,TagSerializer,CategorySerializer,PostSerializer,PostPublishSerializer,NewsletterSerializer,ContactSerializer,CommentSerializer
from .models import Profile,Tag,Category,Post,Newsletter,Comment,Contact
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework import permissions, viewsets
from django.db.models import Q
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status,exceptions
import openai
from django.http import JsonResponse
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")




def summarize_post(request, post_id):
    post = Post.objects.get(id=post_id)

    content = post.content

    response = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Summarize the following article briefly."},
            {"role": "user", "content": content}
        ],
        max_tokens=150
    )

    summary = response['choices'][0]['message']['content']

    return JsonResponse({"summary": summary})

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# Create your views here.
def home(request):
  return render(request,'home.html')



class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class NavigationDataView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 1. Fetch data (same logic as navigation.py)
        categories = Category.objects.all()[:4]
        tags = Tag.objects.all()[:10]
        trending_posts = Post.objects.filter(
            published_at__isnull=False, 
            status="active"
        ).order_by("-views_count")[:3]

        # 2. Serialize data
        # We use your existing serializers
        category_serializer = CategorySerializer(categories, many=True)
        tag_serializer = TagSerializer(tags, many=True)
        post_serializer = PostSerializer(trending_posts, many=True)

        # 3. Return combined JSON
        return Response({
            "categories": category_serializer.data,
            "tags": tag_serializer.data,
            "trending_posts": post_serializer.data,
        })
    
class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ["list","retrieve"]:
            return [permissions.AllowAny()]
        return super().get_permissions()
    
    
    
class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Category.objects.all().order_by('name')
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_permissions(self):
        if self.action in ["list","retrieve"]:
            return [permissions.AllowAny()]
        return super().get_permissions()
    
class PostViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action in ["list","retrieve"]:
            queryset = queryset.filter(status="active", published_at__isnull=False)
            #search:
            search_term = self.request.GET.get("search", None)
            if search_term:
                # Search by title and content(case-insensitive)
                queryset = queryset.filter(
                    Q(title__icontains=search_term) | Q(content__icontains=search_term)
                )
            return queryset
        
    def get_permissions(self):
        if self.action in ["list","retrieve"]:
            return [permissions.AllowAny()]
        return super().get_permissions()
class PostPublishViewSet(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class=PostPublishSerializer
    
    def post(self,request,*args,**kwargs):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data=serializer.data 
            # publish the post
            post=Post.objects.get(pk=data["id"])
            post.published_at=timezone.now()
            post.save()
            serialized_data=PostSerializer(post).data
            return Response(serialized_data, status=status.HTTP_200_OK)

class PostListByCategoryViewSet(ListAPIView):
    queryset=Post.objects.all()
    serializer_class=PostSerializer
    permission_classes=[permissions.AllowAny]
    
    def get_queryset(self):
        queryset=super().get_queryset()
        queryset=queryset.filter(
            status="active",
            published_at__isnull=False,
            category=self.kwargs["category_id"],
        )
        return queryset
        
class PostListByTagViewSet(ListAPIView):
    queryset=Post.objects.all()
    serializer_class=PostSerializer
    permission_classes=[permissions.AllowAny]
    
    def get_queryset(self):
        queryset=super().get_queryset()
        queryset=queryset.filter(
            status="active",
            published_at__isnull=False,
            tag=self.kwargs["tag_id"],
        )
        return queryset
    
class DraftListViewSet(ListAPIView):
    queryset=Post.objects.filter(published_at__isnull=True)
    serializer_class=PostSerializer
    permission_classes=[permissions.IsAuthenticated]
    

class NewsletterViewSet(APIView):
    queryset=Newsletter.objects.all()
    serializer_class=NewsletterSerializer
    permission_classes=[permissions.AllowAny]
    
    def get_permissions(self):
        if self.action in ["list","retrieve","destroy"]:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()
    
    def update(self, request, *args, **kwargs):
        raise exceptions.MethodNotAllowed(request.method)
    
class ContactView(APIView):
    permission_classes = [permissions.AllowAny]
    # Use request.method instead of self.action
    def get_permissions(self):
        if self.request.method in ["GET", "DELETE"]:
            return [permissions.IsAuthenticated()] # Only admins should see or delete contacts
        return [permissions.AllowAny()] # Anyone can send (POST) a contact message
    
""" class CommentViewSet(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, *args, **kwargs):
        comments=Comment.objects.filter(post=post_id).order_by('-created_at')
        serialized_data=CommentSerializer(comments,many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)
    
    def post(self, request, post_id, *args, **kwargs):
        request.data.update({"post":post_id})
        serializer=CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED) """

class CommentViewSet(APIView):
    permission_classes = [permissions.AllowAny]
    
    # Add 'post_id' to the method arguments
    def get(self, request, post_id, *args, **kwargs):
        # Now post_id is defined from your URL path
        comments = Comment.objects.filter(post=post_id).order_by('-created_at')
        serialized_data = CommentSerializer(comments, many=True).data
        return Response(serialized_data, status=status.HTTP_200_OK)
    
    def post(self, request, post_id, *args, **kwargs):
        # You already have post_id here, which is correct
        request.data.update({"post": post_id})
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)



