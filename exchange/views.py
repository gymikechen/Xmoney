from django.views.decorators.http import require_POST, require_GET
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .forms import CreateExchangeForm

def index(request):
    return render(request, 'exchange/index.html')

@csrf_exempt
def create_sheet(request):
    form = CreateExchangeForm(request.POST)
    response = {}

    if request.method =='POST' and form.is_valid():
       form.save()
    else:
        form = CreateExchangeForm()

    return render(request, 'exchange/base.html', {'form': form})

