from django.conf.urls import patterns, include, url

from . import views

urlpatterns = patterns('',
    url(r'^index', views.index, name='index'),
    url(r'^create_sheet', views.create_sheet, name='create_sheet'),
)
