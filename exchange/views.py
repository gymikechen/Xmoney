from django.views.generic import UpdateView, ListView, CreateView
from django.views.decorators.http import require_POST, require_GET
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.template.loader import render_to_string
from django.core.urlresolvers import reverse, reverse_lazy

from .models import Sheet 
from .forms import CreateExchangeForm

def index(request):
    return render(request, 'exchange/index.html')

@csrf_exempt
def create_sheet(request):
    form = CreateExchangeForm(request.POST)
    response = {}

    if request.method =='POST' and form.is_valid():
        form.save()
        return render(request, 'exchange/index.html')
    else:
        form = CreateExchangeForm()
        return render(request, 'exchange/create_sheet.html', {'form': form})

