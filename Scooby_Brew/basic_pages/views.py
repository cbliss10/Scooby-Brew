from django.shortcuts import render
from basic_pages.forms import RegistrationForm

# Create your views here.
def index(request):
    page_dict = {'page_title':'Welcome'}
    return render(request,'basic_pages/index.html',page_dict)

def register(request):

    registered = False

    if request.method == 'POST':
        registration_form = RegistrationForm(data=request.POST)

        if registration_form.is_valid():
            user = registration_form.save()
            user.set_password(user.password)
            user.save()
            registered = True
        else:
            print(registration_form.errors)
    else:
        registration_form = RegistrationForm()

    return render(request, 'basic_pages/registration.html',
                            {'registration_form':registration_form,
                            'registered':registered})
