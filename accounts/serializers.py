from partners.serializers import PartnerSerializer
from partners.models import Partner
from rest_framework import serializers
from .models import User
from django.contrib.auth import authenticate


class UserSerializer(serializers.ModelSerializer):
    partner = PartnerSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'partner']


class RegisterSerializer(serializers.ModelSerializer):
    name = serializers.CharField()

    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'name']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            validated_data['username'], '', validated_data['password'])
        partner = Partner(name=self.initial_data.get('name'), owner=user)
        user.partner = partner
        partner.save()
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
