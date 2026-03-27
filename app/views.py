from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializer
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer,TagSerializer,CategorySerializer,PostSerializer,PostPublishSerializer,NewsletterSerializer,ContactSerializer,CommentSerializer,PollSerializer,PollOptionSerializer,PromotionSerializer,VideoAdSerializer
from .models import Profile,Tag,Category,Post,Newsletter,Comment,Contact,Poll,PollOption,Promotion,VideoAd
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import MyTokenObtainPairSerializer
from rest_framework import permissions, viewsets
from django.db.models import Q
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status,exceptions
import openai
from openai import OpenAI
from django.http import JsonResponse
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def summarize_post(request, post_id):
    post = Post.objects.get(id=post_id)

    content = post.content

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Summarize the following article briefly."},
            {"role": "user", "content": content}
        ],
        max_tokens=150
    )

    summary = response.choices[0].message.content

    return JsonResponse({"summary": summary})

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class NavigationDataView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # 1. Fetch data 
        categories = Category.objects.all()[:4]
        tags = Tag.objects.all()[:10]
        trending_posts = Post.objects.filter(
            published_at__isnull=False, 
            status="active"
        ).order_by("-views_count")[:5]

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
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        queryset = super().get_queryset()
        user = self.request.user

        if self.action in ["list", "retrieve"]:
            # If user is staff/superuser, they see everything (drafts included)
            # Regular users only see active & published posts
            if not (user.is_authenticated and (user.is_staff or user.is_superuser)):
                queryset = queryset.filter(status="active", published_at__isnull=False)
            
            #search:
            search_term = self.request.GET.get("search", None)
            if search_term:
                # Search by title and content(case-insensitive)
                queryset = queryset.filter(
                    Q(title__icontains=search_term) | Q(content__icontains=search_term)
                )
            
            # category filter (case-insensitive)
            category_slug = self.request.GET.get("category", None)
            if category_slug:
                queryset = queryset.filter(category__name__iexact=category_slug)
                
            # tag filter (case-insensitive for ManyToMany)
            tag_slug = self.request.GET.get("tag", None)
            if tag_slug:
                queryset = queryset.filter(tag__name__iexact=tag_slug).distinct()

        return queryset
        
    def get_permissions(self):
        if self.action in ["list","retrieve","view"]:
            return [permissions.AllowAny()]
        return super().get_permissions()

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def view(self, request, pk=None):
        post = self.get_object()
        post.views_count += 1
        post.save(update_fields=['views_count'])
        return Response({'status': 'view counted', 'views': post.views_count})

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_posts(self, request):
        queryset = Post.objects.filter(author=request.user).order_by('-created_at')
        from .serializers import PostSerializer
        serializer = PostSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAdminUser])
    def admin_posts(self, request):
        """Returns ALL posts including drafts. Only accessible by admins."""
        queryset = Post.objects.all().order_by('-created_at')
        serializer = PostSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def publish(self, request):
        """Publishes a draft post. Only accessible by admins."""
        post_id = request.data.get('id')
        if not post_id:
            return Response({'error': 'Post ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        post.published_at = timezone.now()
        post.save()
        serialized_data = PostSerializer(post, context={'request': request}).data
        return Response(serialized_data, status=status.HTTP_200_OK)
class PostPublishViewSet(APIView):
    permission_classes=[permissions.IsAdminUser]
    serializer_class=PostPublishSerializer
    
    def post(self,request,*args,**kwargs):
        serializer=self.serializer_class(data=request.data)
        if serializer.is_valid(raise_exception=True):
            data=serializer.data 
            # publish the post
            post=Post.objects.get(pk=data["id"])
            post.published_at=timezone.now()
            post.save()
            serialized_data = PostSerializer(post, context={'request': request}).data
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
    

class NewsletterViewSet(viewsets.ModelViewSet):
    queryset = Newsletter.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_permissions(self):
        if self.action in ["list", "retrieve", "destroy", "update", "partial_update"]:
            return [permissions.IsAuthenticated()]
        return super().get_permissions()
    
class ContactView(APIView):
    permission_classes = [permissions.AllowAny]
    # Use request.method instead of self.action
    def get_permissions(self):
        if self.request.method in ["GET", "DELETE"]:
            return [permissions.IsAuthenticated()] # Only admins should see or delete contacts
        return [permissions.AllowAny()] # Anyone can send (POST) a contact message
    

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

class PollViewSet(viewsets.ModelViewSet):
    queryset = Poll.objects.filter(active=True).order_by('-created_at')
    serializer_class = PollSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'vote']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['post'])
    def vote(self, request, pk=None):
        poll = self.get_object()
        option_id = request.data.get('option_id')
        try:
            option = poll.options.get(id=option_id)
            option.votes += 1
            option.save()
            return Response(PollSerializer(poll).data)
        except PollOption.DoesNotExist:
            return Response({'error': 'Invalid option'}, status=status.HTTP_400_BAD_REQUEST)


class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return super().get_permissions()

class VideoAdViewSet(viewsets.ModelViewSet):
    queryset = VideoAd.objects.filter(is_active=True).order_by('-created_at')
    serializer_class = VideoAdSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.AllowAny()]
        return super().get_permissions()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('username')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

    def list(self, request, *args, **kwargs):
        search_term = request.GET.get('search', None)
        if search_term:
            users = User.objects.filter(
                Q(username__icontains=search_term) | Q(email__icontains=search_term)
            ).order_by('username')[:50]
            serializer = self.get_serializer(users, many=True)
            return Response(serializer.data)

        authors = User.objects.filter(profile__is_author=True).order_by('username')
        authors_count = authors.count()
        needed_recent = max(0, 12 - authors_count)
        
        if needed_recent > 0:
            recent_users = User.objects.filter(
                Q(profile__is_author=False) | Q(profile__isnull=True)
            ).order_by('-date_joined')[:needed_recent]
            combined_users = list(authors) + list(recent_users)
        else:
            combined_users = list(authors)
            
        serializer = self.get_serializer(combined_users, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def toggle_author(self, request, pk=None):
        user = self.get_object()
        profile, created = Profile.objects.get_or_create(user=user)
        profile.is_author = not profile.is_author
        profile.save()
        return Response({'status': 'author status toggled', 'is_author': profile.is_author})

    @action(detail=False, methods=['get'])
    def author_count(self, request):
        count = Profile.objects.filter(is_author=True).count()
        return Response({'count': count})
