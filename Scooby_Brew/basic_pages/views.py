from django.shortcuts import render
from django.http import request

# Create your views here.
def index(request):
    page_dict = {'page_title':'Welcome'}
    return render(request,'basic_pages/index.html',page_dict)
