from rest_framework import serializers


class UIAnalyzeSerializer(serializers.Serializer):
    image = serializers.ImageField()
