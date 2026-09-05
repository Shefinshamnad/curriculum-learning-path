from django.urls import path

from .views import ModuleListView, SavePathView


urlpatterns = [
    path('modules/', ModuleListView.as_view(), name='module-list'),
    path('save-path/', SavePathView.as_view(), name='save-path'),
]

